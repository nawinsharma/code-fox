import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { PLAN_LIMITS } from "@/lib/plan-limits";

export async function GET() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.user.id;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				email: true,
				name: true,
				subscriptionTier: true,
				prsUsed: true,
				prsCreated: true,
				issuesUsed: true,
				chatMessagesUsed: true,
				billingCycleStart: true,
			},
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const repositories = await prisma.repository.findMany({
			where: { userId },
			select: {
				id: true,
				fullName: true,
				indexingStatus: true,
			},
		});

		const [totalPRs, totalIssues] = await Promise.all([
			prisma.review.count({
				where: { repository: { userId } },
			}),
			prisma.issue.count({
				where: { repository: { userId } },
			}),
		]);

		// Build 90-day chart data
		const ninetyDaysAgo = new Date();
		ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

		const [reviews, issues] = await Promise.all([
			prisma.review.findMany({
				where: {
					repository: { userId },
					createdAt: { gte: ninetyDaysAgo },
				},
				select: { createdAt: true },
			}),
			prisma.issue.findMany({
				where: {
					repository: { userId },
					analyzedAt: { gte: ninetyDaysAgo },
				},
				select: { analyzedAt: true },
			}),
		]);

		const chartData = buildChartData(reviews, issues);

		return NextResponse.json({
			user: {
				email: user.email,
				name: user.name,
				plan: user.subscriptionTier as "FREE" | "PRO",
				prsUsed: user.prsUsed,
				prsCreated: user.prsCreated,
				issuesUsed: user.issuesUsed,
				chatMessagesUsed: user.chatMessagesUsed,
				billingCycleStart: user.billingCycleStart,
			},
			stats: {
				totalPRs,
				totalIssues,
				repoCount: repositories.length,
				repoName: repositories[0]?.fullName || null,
				indexingStatus: repositories[0]?.indexingStatus || "NOT_STARTED",
				githubAccount: session.user.name || null,
			},
			chartData,
			limits: PLAN_LIMITS,
		});
	} catch (error) {
		console.error("Dashboard API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

function buildChartData(
	reviews: { createdAt: Date }[],
	issues: { analyzedAt: Date }[],
) {
	const dateMap: Record<string, { pullRequests: number; issues: number }> = {};

	// Initialize 90 days
	for (let i = 89; i >= 0; i--) {
		const d = new Date();
		d.setDate(d.getDate() - i);
		const key = d.toISOString().split("T")[0];
		dateMap[key] = { pullRequests: 0, issues: 0 };
	}

	reviews.forEach((r) => {
		const key = r.createdAt.toISOString().split("T")[0];
		if (dateMap[key]) dateMap[key].pullRequests++;
	});

	issues.forEach((i) => {
		const key = i.analyzedAt.toISOString().split("T")[0];
		if (dateMap[key]) dateMap[key].issues++;
	});

	return Object.entries(dateMap).map(([date, data]) => ({
		date,
		...data,
	}));
}
