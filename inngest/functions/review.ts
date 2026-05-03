/**
 * Inngest background job functions for Code Fox
 * 
 * This module contains serverless functions that handle:
 * - AI code review generation
 * - Repository indexing for RAG
 * - Webhook processing
 * 
 * All functions are executed asynchronously to avoid blocking the main application
 * and provide reliable processing with automatic retries.
 * 
 * @module inngest/functions
 */
import { inngest } from "../client";
import {
	getAccessTokenByUserId,
	getPullRequestDiff,
	postReviewComment,
} from "@/modules/github/lib/github";
import { retrieveContext } from "@/modules/ai/lib/rag";
import prisma from "@/lib/db";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

/**
 * Inngest function to generate an AI code review for a Pull Request.
 *
 * Triggered by: "pr.review.requested" event.
 *
 * Workflow:
 * 1. **fetch-pr-data**: Retrieves the PR diff, title, and description from GitHub.
 * 2. **retrieve-context**: Uses RAG to fetch relevant code snippets from the vector DB based on PR content.
 * 3. **generate-ai-review**: Sends the diff and context to Google Gemini to generate the review markdown.
 * 4. **post-comment**: Posts the generated review as a comment on the GitHub PR.
 * 5. **save-review**: Saves the review details to the database.
 */
export const generateReview = inngest.createFunction(
	{
		id: "generate-review",
		concurrency: 5,
		triggers: [{ event: "pr.review.requested" }],
		onFailure: async ({ event }) => {
			const reviewId = event.data.event.data.reviewId;
			if (reviewId) {
				await prisma.review.update({
					where: { id: reviewId },
					data: {
						status: "failed",
						review: "Review generation failed. Please retry.",
					},
				});
			}
		},
	},
	async ({ event, step }) => {
		const { owner, repo, prNumber, userId, reviewId } = event.data;

		const token = await step.run("get-token", async () => {
			return await getAccessTokenByUserId(userId);
		});

		const { diff, title, description } = await step.run(
			"fetch-pr-data",
			async () => {
				return await getPullRequestDiff(
					token as string,
					owner,
					repo,
					prNumber
				);
			}
		);

		const context = await step.run("retrieve-context", async () => {
			const query = `${title}\n${description}`;

			return await retrieveContext(query, `${owner}/${repo}`);
		});

		const review = await step.run("generate-ai-review", async () => {
			const prompt = `You are an expert code reviewer. Analyze the following pull request and provide a detailed, constructive code review.

PR Title: ${title}
PR Description: ${description || "No description provided"}

Context from Codebase:
${context.join("\n\n")}

Code Changes:
\`\`\`diff
${diff}
\`\`\`

Please provide:
1. **Walkthrough**: A file-by-file explanation of the changes.
2. **Sequence Diagram**: A Mermaid JS sequence diagram visualizing the flow of the changes (if applicable). Use \`\`\`mermaid ... \`\`\` block. 
   **STRICT MERMAID RULES**:
   - Start with \`sequenceDiagram\`.
   - **MUST** explicitly declare all participants at the top using \`participant Alias as Name\`.
   - **DO NOT** use special characters like parentheses \`()\`, slashes \`/\`, dots \`.\`, brackets \`[]\`, or braces \`{}\` in participant names or message labels. Use only alphanumeric characters and spaces.
   - Example of a GOOD label: \`Process Payment Request\`
   - Example of a BAD label: \`processPayment(data)\`
   - Keep the diagram focused on the core logic changes.
   - If a diagram is not helpful for these changes, omit this section entirely.
3. **Summary**: Brief overview.
4. **Strengths**: What's done well.
5. **Issues**: Bugs, security concerns, code smells.
6. **Suggestions**: Specific code improvements.
7. **Poem**: A short, creative poem summarizing the changes at the very end.

Format your response in markdown.`;

			const { text } = await generateText({
				model: google("gemini-2.5-flash"),
				prompt,
			});

			return text;
		});

		await step.run("post-comment", async () => {
			await postReviewComment(token as string, owner, repo, prNumber, review as string);
		});

		await step.run("save-review", async () => {
			await prisma.review.update({
				where: { id: reviewId },
				data: {
					prTitle: title,
					review: review as string,
					status: "completed",
				},
			});

			await prisma.user.update({
				where: { id: userId },
				data: { prsUsed: { increment: 1 } },
			});
		});
		return { success: true };
	}
);
