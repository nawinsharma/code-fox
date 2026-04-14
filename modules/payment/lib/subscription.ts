"use server";

import prisma from "@/lib/db";
import { PLAN_LIMITS } from "@/lib/plan-limits";

export type SubscriptionTier = "FREE" | "PRO";
export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "EXPIRED";

export interface UserLimits {
	tier: SubscriptionTier;
	repositories: {
		current: number;
		limit: number | null;
		canAdd: boolean;
	};
	reviews: {
		[repositoryId: string]: {
			current: number;
			limit: number | null;
			canAdd: boolean;
		};
	};
}

/**
 * Retrieves user's current subscription tier.
 */
export async function getUserTier(userId: string): Promise<SubscriptionTier> {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			subscriptionTier: true,
		},
	});

	return (user?.subscriptionTier as SubscriptionTier) || "FREE";
}

/**
 * Retrieves the user's usage record. Creates one if it doesn't exist.
 * @param userId - User ID.
 * @returns UserUsage record.
 */
async function getUserUsage(userId: string) {
	let usage = await prisma.userUsage.findUnique({
		where: {
			userId: userId,
		},
	});

	if (!usage) {
		usage = await prisma.userUsage.create({
			data: {
				userId: userId,
				repositoryCount: 0,
				reviewCounts: {},
			},
		});
	}

	return usage;
}

/**
 * Checks if the user can connect a new repository based on their tier limits.
 */
export async function canConnectRepository(userId: string) {
	const tier = await getUserTier(userId);
	const limit = PLAN_LIMITS[tier].repositories;

	if (limit === null) return true;

	const usage = await getUserUsage(userId);
	return usage.repositoryCount < limit;
}

/**
 * Checks if the user can request a review for a specific repository.
 */
export async function canCreateReview(
	userId: string,
	repositoryId: string
): Promise<boolean> {
	const tier = await getUserTier(userId);
	const limit = PLAN_LIMITS[tier].reviewsPerRepo;

	if (limit === null) return true;

	const usage = await getUserUsage(userId);
	const reviewCounts = usage.reviewCounts as Record<string, number>;
	const currentCount = reviewCounts[repositoryId] || 0;

	return currentCount < limit;
}

/**
 * Increments the repository count for a user.
 * @param userId - User ID.
 */
export async function incrementRepositoryCount(userId: string): Promise<void> {
	await prisma.userUsage.upsert({
		where: { userId },
		create: {
			userId,
			repositoryCount: 1,
			reviewCounts: {},
		},
		update: {
			repositoryCount: {
				increment: 1,
			},
		},
	});
}

/**
 * Decrements the repository count for a user.
 * @param userId - User ID.
 */
export async function decrementRepositoryCount(userId: string): Promise<void> {
	const usage = await getUserUsage(userId);

	await prisma.userUsage.update({
		where: { userId },
		data: {
			repositoryCount: Math.max(0, usage.repositoryCount - 1),
		},
	});
}

/**
 * Increments the review count for a specific repository.
 * @param userId - User ID.
 * @param repositoryId - Repository ID.
 */
export async function incrementReviewCount(
	userId: string,
	repositoryId: string
): Promise<void> {
	const usage = await getUserUsage(userId);
	const reviewCounts = usage.reviewCounts as Record<string, number>;

	reviewCounts[repositoryId] = (reviewCounts[repositoryId] || 0) + 1;

	await prisma.userUsage.update({
		where: { userId },
		data: {
			reviewCounts,
		},
	});
}

/**
 * Calculates remaining limits for the user.
 * @param userId - User ID.
 * @returns Object with detailed limit information.
 */
export async function getRemainingLimits(userId: string): Promise<UserLimits> {
	const tier = await getUserTier(userId);
	const usage = await getUserUsage(userId);
	const reviewCounts = usage.reviewCounts as Record<string, number>;

	const repoLimit = PLAN_LIMITS[tier].repositories;
	const reviewLimit = PLAN_LIMITS[tier].reviewsPerRepo;

	const limits: UserLimits = {
		tier,
		repositories: {
			current: usage.repositoryCount,
			limit: repoLimit,
			canAdd: repoLimit === null || usage.repositoryCount < repoLimit,
		},
		reviews: {},
	};

	const repositories = await prisma.repository.findMany({
		where: { userId },
		select: { id: true },
	});

	for (const repo of repositories) {
		const currentCount = reviewCounts[repo.id] || 0;
		limits.reviews[repo.id] = {
			current: currentCount,
			limit: reviewLimit,
			canAdd: reviewLimit === null || currentCount < reviewLimit,
		};
	}

	return limits;
}

/**
 * Updates the user's subscription tier, status, and optionally the Polar subscription ID.
 */
export async function updateUserTier(
	userId: string,
	tier: SubscriptionTier,
	status: SubscriptionStatus,
	polarSubscriptionId?: string
): Promise<void> {
	await prisma.user.update({
		where: { id: userId },
		data: {
			subscriptionTier: tier,
			subscriptionStatus: status,
			...(polarSubscriptionId !== undefined && { polarSubscriptionId }),
		},
	});
}

/**
 * Updates the user's Polar customer ID.
 * @param userId - User ID.
 * @param polarCustomerId - Polar Customer ID.
 */
export async function updatePolarCustomerId(
	userId: string,
	polarCustomerId: string
): Promise<void> {
	await prisma.user.update({
		where: { id: userId },
		data: {
			polarCustomerId,
		},
	});
}
