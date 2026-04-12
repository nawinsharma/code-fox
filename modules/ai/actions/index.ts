"use server";

import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import {
	canCreateReview,
	incrementReviewCount,
} from "@/modules/payment/lib/subscription";
import { PLAN_LIMITS, type PlanType } from "@/lib/plan-limits";

/**
 * Initiates an AI-powered code review for a pull request
 * @param owner - Repository owner username
 * @param repo - Repository name
 * @param prNumber - Pull request number
 * @returns Promise with success status and message
 */
export async function reviewPullRequest(
	owner: string,
	repo: string,
	prNumber: number
) {
	try {
		const respository = await prisma.repository.findFirst({
			where: {
				owner,
				name: repo,
			},
			include: {
				user: {
					include: {
						accounts: {
							where: {
								providerId: "github",
							},
						},
					},
				},
			},
		});

		if (!respository) {
			throw new Error(
				`Repository ${owner}/${repo} not found in database. Please reconnect the repository.`
			);
		}

		const canReview = await canCreateReview(
			respository.user.id,
			respository.id
		);

		if (!canReview) {
			throw new Error(
				"Review limit reached for this repository. Please upgrade to PRO for unlimited reviews."
			);
		}

		const githubAccount = respository.user.accounts[0];

		if (!githubAccount?.accessToken) {
			throw new Error(
				`No GitHub access token found for repository owner.`
			);
		}

		const token = githubAccount.accessToken;

		await inngest.send({
			name: "pr.review.requested",
			data: {
				owner,
				repo,
				prNumber,
				userId: respository.user.id,
			},
		});

		await incrementReviewCount(respository.user.id, respository.id);

		return { success: true, message: "Review Queued" };
	} catch (error) {
		try {
			const repository = await prisma.repository.findFirst({
				where: {
					owner,
					name: repo,
				},
			});

			if (repository) {
				await prisma.review.create({
					data: {
						repositoryId: repository.id,
						prNumber,
						prTitle: "Failed to fetch PR",
						prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
						review: `Error: ${
							error instanceof Error
								? error.message
								: "Unknown Error"
						}`,
						status: "failed",
					},
				});
			}
		} catch (dbError) {
			console.error("Failed to save error to database:", dbError);
		}
	}
}

export async function analyzeIssue(
	owner: string,
	repo: string,
	issueNumber: number,
	issueTitle: string,
	issueBody: string
) {
	try {
		const repository = await prisma.repository.findFirst({
			where: { owner, name: repo },
			include: {
				user: {
					include: {
						accounts: {
							where: { providerId: "github" },
						},
					},
				},
			},
		});

		if (!repository) {
			throw new Error(`Repository ${owner}/${repo} not found`);
		}

		const user = repository.user;
		const plan = user.subscriptionTier as PlanType;
		const limit = PLAN_LIMITS[plan].issues;

		if (user.issuesUsed >= limit) {
			throw new Error("Issue analysis limit reached");
		}

		await inngest.send({
			name: "issue.analysis.requested",
			data: {
				owner,
				repo,
				issueNumber,
				issueTitle,
				issueBody,
				userId: user.id,
				repositoryId: repository.id,
			},
		});

		await prisma.user.update({
			where: { id: user.id },
			data: { issuesUsed: { increment: 1 } },
		});

		return { success: true };
	} catch (error) {
		console.error("Issue analysis error:", error);
	}
}
