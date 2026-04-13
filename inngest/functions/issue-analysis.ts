import { inngest } from "../client";
import { postIssueComment } from "@/modules/github/lib/github";
import { retrieveContext } from "@/modules/ai/lib/rag";
import prisma from "@/lib/db";

import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export const analyzeIssueJob = inngest.createFunction(
	{ id: "analyze-issue", concurrency: 5, triggers: [{ event: "issue.analysis.requested" }] },
	async ({ event, step }) => {
		const {
			owner,
			repo,
			issueNumber,
			issueTitle,
			issueBody,
			userId,
			repositoryId,
		} = event.data;

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
			return await retrieveContext(query, `${owner}/${repo}`);
		});

		const rules = await step.run("fetch-rules", async () => {
			const userRules = await prisma.rule.findMany({
				where: { userId },
				select: { content: true },
			});
			return userRules.map((r) => r.content);
		});

		const analysis = await step.run("generate-analysis", async () => {
			const rulesSection =
				rules.length > 0
					? `\nCustom Rules:\n${rules.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n`
					: "";

			const prompt = `You are an expert software engineer. Analyze the following GitHub issue and suggest approaches to fix it.

Issue Title: ${issueTitle}
Issue Description: ${issueBody || "No description provided"}
${rulesSection}
Relevant Code Context:
${context.join("\n\n")}

Please provide:
1. **Analysis**: Understanding of the issue and its root cause
2. **Suggested Approach**: Step-by-step approach to fix the issue
3. **Files to Modify**: Which files likely need changes
4. **Code Suggestions**: Specific code changes if possible

Format your response in markdown.`;

			const { text } = await generateText({
				model: anthropic("claude-sonnet-4-6-20250514"),
				prompt,
			});

			return text;
		});

		await step.run("post-comment", async () => {
			await postIssueComment(
				token as string,
				owner,
				repo,
				issueNumber,
				analysis as string,
			);
		});

		await step.run("save-issue", async () => {
			await prisma.issue.create({
				data: {
					githubId: BigInt(issueNumber),
					number: issueNumber,
					title: issueTitle,
					repositoryId,
				},
			});
		});

		return { success: true };
	},
);
