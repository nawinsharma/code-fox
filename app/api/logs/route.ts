import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(req.url);
		const type = searchParams.get("type");
		const repoId = searchParams.get("repoId");
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");

		const userId = session.user.id;

		const repositories = await prisma.repository.findMany({
			where: { userId },
			select: { id: true, fullName: true },
		});

		const repoIds = repoId && repoId !== "all"
			? [repoId]
			: repositories.map((r) => r.id);

		const dateFilter: { gte?: Date; lte?: Date } = {};
		if (startDate) dateFilter.gte = new Date(startDate);
		if (endDate) dateFilter.lte = new Date(endDate);

		const logs: {
			id: string;
			type: "pr" | "issue";
			number: number;
			title: string;
			repository: string;
			date: string;
		}[] = [];

		if (type !== "issue") {
			const reviews = await prisma.review.findMany({
				where: {
					repositoryId: { in: repoIds },
					...(Object.keys(dateFilter).length > 0
						? { createdAt: dateFilter }
						: {}),
				},
				include: { repository: { select: { fullName: true } } },
				orderBy: { createdAt: "desc" },
			});

			reviews.forEach((r) => {
				logs.push({
					id: r.id,
					type: "pr",
					number: r.prNumber,
					title: r.prTitle,
					repository: r.repository.fullName,
					date: r.createdAt.toISOString(),
				});
			});
		}

		if (type !== "pr") {
			const issues = await prisma.issue.findMany({
				where: {
					repositoryId: { in: repoIds },
					...(Object.keys(dateFilter).length > 0
						? { analyzedAt: dateFilter }
						: {}),
				},
				include: { repository: { select: { fullName: true } } },
				orderBy: { analyzedAt: "desc" },
			});

			issues.forEach((i) => {
				logs.push({
					id: i.id,
					type: "issue",
					number: i.number,
					title: i.title,
					repository: i.repository.fullName,
					date: i.analyzedAt.toISOString(),
				});
			});
		}

		logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		return NextResponse.json({ logs, repositories });
	} catch (error) {
		console.error("Logs API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
