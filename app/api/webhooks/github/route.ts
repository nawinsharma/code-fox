import { reviewPullRequest, analyzeIssue } from "@/modules/ai/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const event = request.headers.get("x-github-event");

		console.log(`Received GitHub event: ${event}`);

		if (event === "ping") {
			return NextResponse.json({ message: "Pong" }, { status: 200 });
		}

		if (event === "pull_request") {
			const action = body.action;
			const repo = body.repository.full_name;
			const prNumber = body.number;
			const prTitle = body.pull_request?.title;
			const [owner, repoName] = repo.split("/");

			if (action === "opened" || action === "synchronize") {
				reviewPullRequest(owner, repoName, prNumber, prTitle)
					.then(() =>
						console.log(
							`Successfully processed PR ${prNumber} for ${repo}`,
						),
					)
					.catch((error: unknown) =>
						console.error(
							`Failed to process PR ${prNumber} for ${repo}:`,
							error,
						),
					);
			}
		}

		if (event === "issues") {
			const action = body.action;
			const repo = body.repository.full_name;
			const issueNumber = body.issue.number;
			const issueTitle = body.issue.title;
			const issueBody = body.issue.body || "";
			const [owner, repoName] = repo.split("/");

			if (action === "opened") {
				analyzeIssue(owner, repoName, issueNumber, issueTitle, issueBody)
					.then(() =>
						console.log(
							`Successfully queued issue ${issueNumber} for ${repo}`,
						),
					)
					.catch((error: unknown) =>
						console.error(
							`Failed to process issue ${issueNumber} for ${repo}:`,
							error,
						),
					);
			}
		}

		return NextResponse.json(
			{ message: "Event processed" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error processing webhook:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
