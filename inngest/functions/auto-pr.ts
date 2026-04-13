import { inngest } from "../client";
import { retrieveContext } from "@/modules/ai/lib/rag";
import { postIssueComment } from "@/modules/github/lib/github";
import prisma from "@/lib/db";
import { Octokit } from "octokit";

import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export const autoPRJob = inngest.createFunction(
	{ id: "auto-pr-generation", concurrency: 3, triggers: [{ event: "issue.auto-pr" }] },
	async ({ event, step }) => {
		const { owner, repo, issueNumber, issueTitle, issueBody, userId } =
			event.data;

		const token = await step.run("get-token", async () => {
			const account = await prisma.account.findFirst({
				where: { userId, providerId: "github" },
			});
			if (!account?.accessToken) {
				throw new Error("No GitHub access token found");
			}
			return account.accessToken;
		});

		const context = await step.run("retrieve-context", async () => {
			const query = `${issueTitle}\n${issueBody}`;
			return await retrieveContext(query, `${owner}/${repo}`, 10);
		});

		const rules = await step.run("fetch-rules", async () => {
			const userRules = await prisma.rule.findMany({
				where: { userId },
				select: { content: true },
			});
			return userRules.map((r) => r.content);
		});

		const plan = await step.run("plan-changes", async () => {
			const rulesSection =
				rules.length > 0
					? `\nCustom Rules:\n${rules.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n`
					: "";

			const prompt = `You are an expert software engineer. Based on the following issue and code context, plan the exact file changes needed to fix the issue.

Issue Title: ${issueTitle}
Issue Description: ${issueBody || "No description provided"}
${rulesSection}
Relevant Code Context:
${context.join("\n\n")}

Return a JSON array of changes. Each change should have:
- "path": file path
- "action": "modify" | "create" | "delete"
- "description": what to change

Return ONLY valid JSON, no markdown fencing.

Example:
[{"path": "src/utils.ts", "action": "modify", "description": "Add null check in processData function"}]`;

			const { text } = await generateText({
				model: anthropic("claude-sonnet-4-6-20250514"),
				prompt,
			});

			try {
				return JSON.parse(text.replace(/```json?\n?/g, "").replace(/```/g, "").trim());
			} catch {
				return [];
			}
		});

		if (!plan || plan.length === 0) {
			await step.run("comment-no-changes", async () => {
				await postIssueComment(
					token as string,
					owner,
					repo,
					issueNumber,
					"I analyzed this issue but couldn't determine specific file changes to make. Please provide more details.",
				);
			});
			return { success: false, reason: "No changes planned" };
		}

		const branchName = `codefox/issue-${issueNumber}`;

		await step.run("create-branch-and-changes", async () => {
			const octokit = new Octokit({ auth: token });

			// Get default branch ref
			const { data: repoData } = await octokit.rest.repos.get({
				owner,
				repo,
			});
			const defaultBranch = repoData.default_branch;

			const { data: ref } = await octokit.rest.git.getRef({
				owner,
				repo,
				ref: `heads/${defaultBranch}`,
			});

			// Create branch
			try {
				await octokit.rest.git.createRef({
					owner,
					repo,
					ref: `refs/heads/${branchName}`,
					sha: ref.object.sha,
				});
			} catch {
				// Branch may already exist
			}

			// For each planned change, generate and commit
			for (const change of plan) {
				if (change.action === "delete") continue;

				let existingContent = "";
				try {
					const { data } = await octokit.rest.repos.getContent({
						owner,
						repo,
						path: change.path,
						ref: branchName,
					});
					if (!Array.isArray(data) && data.type === "file" && data.content) {
						existingContent = Buffer.from(data.content, "base64").toString("utf-8");
					}
				} catch {
					// File doesn't exist yet
				}

				const generatePrompt = `Generate the complete file content for this change.

File: ${change.path}
Change: ${change.description}
Issue: ${issueTitle}

${existingContent ? `Current file content:\n\`\`\`\n${existingContent}\n\`\`\`` : "This is a new file."}

Return ONLY the complete file content, no markdown fencing, no explanation.`;

				const { text: fileContent } = await generateText({
					model: anthropic("claude-sonnet-4-6-20250514"),
					prompt: generatePrompt,
				});

				const cleanContent = fileContent
					.replace(/^```\w*\n?/, "")
					.replace(/\n?```$/, "")
					.trim();

				// Get existing file SHA if it exists
				let sha: string | undefined;
				try {
					const { data: existing } = await octokit.rest.repos.getContent({
						owner,
						repo,
						path: change.path,
						ref: branchName,
					});
					if (!Array.isArray(existing)) {
						sha = existing.sha;
					}
				} catch {
					// New file
				}

				await octokit.rest.repos.createOrUpdateFileContents({
					owner,
					repo,
					path: change.path,
					message: `fix(#${issueNumber}): ${change.description}`,
					content: Buffer.from(cleanContent).toString("base64"),
					branch: branchName,
					...(sha ? { sha } : {}),
				});
			}
		});

		const prUrl = await step.run("create-pr", async () => {
			const octokit = new Octokit({ auth: token });

			const { data: repoData } = await octokit.rest.repos.get({
				owner,
				repo,
			});

			const { data: pr } = await octokit.rest.pulls.create({
				owner,
				repo,
				title: `fix: ${issueTitle} (#${issueNumber})`,
				body: `## Auto-generated fix for #${issueNumber}\n\n${issueBody || issueTitle}\n\n### Changes\n${plan.map((c: { path: string; description: string }) => `- \`${c.path}\`: ${c.description}`).join("\n")}\n\n---\n*Generated by Code Fox AI*`,
				head: branchName,
				base: repoData.default_branch,
			});

			return pr.html_url;
		});

		await step.run("save-and-comment", async () => {
			const repository = await prisma.repository.findFirst({
				where: { owner, name: repo },
			});

			if (repository) {
				await prisma.review.create({
					data: {
						repositoryId: repository.id,
						prNumber: issueNumber,
						prTitle: `Auto-PR for: ${issueTitle}`,
						prUrl: prUrl as string,
						review: `Auto-generated PR from issue #${issueNumber}`,
						status: "completed",
					},
				});
			}

			await prisma.user.update({
				where: { id: userId },
				data: { prsCreated: { increment: 1 } },
			});

			await postIssueComment(
				token as string,
				owner,
				repo,
				issueNumber,
				`I've created a pull request to fix this issue: ${prUrl}`,
			);
		});

		return { success: true, prUrl };
	},
);
