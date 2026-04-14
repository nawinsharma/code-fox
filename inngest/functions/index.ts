import { inngest } from "../client";
import { getAccessTokenByUserId, getRepoFileContents } from "@/modules/github/lib/github";
import { indexCodebase } from "@/modules/ai/lib/rag";

export const indexRepo = inngest.createFunction(
	{ id: "index-repo", triggers: [{ event: "repository.connected" }] },
	async ({ event, step }) => {
		const { owner, repo, userId } = event.data;

		const token = await step.run("get-token", async () => {
			return await getAccessTokenByUserId(userId);
		});

		const fileCount = await step.run("fetch-files-index-codebase", async () => {
			const files = await getRepoFileContents(
				token as string,
				owner,
				repo
			);

			await indexCodebase(`${owner}/${repo}`, files);

			return files.length;
		});

		return { success: true, indexedFiles: fileCount };
	}
);
