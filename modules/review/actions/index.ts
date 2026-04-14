"use server";

import prisma from "@/lib/db";
import { getGithubAccessToken } from "@/modules/github/lib/github";
import { reviewPullRequest } from "@/modules/ai/actions";
import { requireSession } from "@/modules/auth/utils/auth-utils";
import { Octokit } from "octokit";

export async function getReviews() {
	const session = await requireSession();

	const reviews = await prisma.review.findMany({
		where: {
			repository: {
				userId: session.user.id,
			},
		},
		include: {
			repository: true,
		},
		orderBy: {
			createdAt: "desc",
		},
		take: 50,
	});

	return reviews;
}

export async function getReviewById(id: string) {
	const session = await requireSession();

	const review = await prisma.review.findFirst({
		where: {
			id,
			repository: {
				userId: session.user.id,
			},
		},
		include: {
			repository: true,
		},
	});

	return review;
}

export async function getOpenPullRequests(repositoryId: string) {
	const session = await requireSession();

	const repository = await prisma.repository.findFirst({
		where: {
			id: repositoryId,
			userId: session.user.id,
		},
	});

	if (!repository) {
		throw new Error("Repository not found");
	}

	const token = await getGithubAccessToken();
	const octokit = new Octokit({ auth: token });

	const { data: pullRequests } = await octokit.rest.pulls.list({
		owner: repository.owner,
		repo: repository.name,
		state: "open",
		sort: "updated",
		direction: "desc",
		per_page: 20,
	});

	const existingReviews = await prisma.review.findMany({
		where: {
			repositoryId: repository.id,
			prNumber: { in: pullRequests.map((pr) => pr.number) },
		},
		select: { prNumber: true, status: true },
	});

	const reviewMap = new Map(
		existingReviews.map((r) => [r.prNumber, r.status])
	);

	return pullRequests.map((pr) => ({
		number: pr.number,
		title: pr.title,
		url: pr.html_url,
		author: pr.user?.login ?? "unknown",
		updatedAt: pr.updated_at,
		reviewStatus: reviewMap.get(pr.number) ?? null,
	}));
}

export async function deleteReview(id: string) {
	const session = await requireSession();

	const review = await prisma.review.findFirst({
		where: {
			id,
			repository: {
				userId: session.user.id,
			},
		},
	});

	if (!review) {
		throw new Error("Review not found");
	}

	await prisma.review.delete({
		where: { id },
	});

	return { success: true };
}

export async function requestManualReview(
	repositoryId: string,
	prNumber: number,
	prTitle?: string
) {
	const session = await requireSession();

	const repository = await prisma.repository.findFirst({
		where: {
			id: repositoryId,
			userId: session.user.id,
		},
	});

	if (!repository) {
		throw new Error("Repository not found");
	}

	return await reviewPullRequest(
		repository.owner,
		repository.name,
		prNumber,
		prTitle
	);
}
