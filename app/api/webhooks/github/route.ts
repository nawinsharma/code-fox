import { reviewPullRequest, analyzeIssue } from "@/modules/ai/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const event = request.headers.get("x-github-event");

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
				await reviewPullRequest(owner, repoName, prNumber, prTitle);
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
				await analyzeIssue(owner, repoName, issueNumber, issueTitle, issueBody);
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
