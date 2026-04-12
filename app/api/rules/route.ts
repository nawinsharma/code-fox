import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";

export async function GET() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const rules = await prisma.rule.findMany({
			where: { userId: session.user.id },
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json({ rules });
	} catch (error) {
		console.error("Rules GET error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { content } = await req.json();

		if (!content?.trim()) {
			return NextResponse.json(
				{ error: "Rule content is required" },
				{ status: 400 },
			);
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { subscriptionTier: true },
		});

		const maxRules = user?.subscriptionTier === "PRO" ? 50 : 5;

		const existingCount = await prisma.rule.count({
			where: { userId: session.user.id },
		});

		if (existingCount >= maxRules) {
			return NextResponse.json(
				{ error: "Rule limit reached. Upgrade to Pro for more rules." },
				{ status: 403 },
			);
		}

		const rule = await prisma.rule.create({
			data: {
				content: content.trim(),
				userId: session.user.id,
			},
		});

		return NextResponse.json({ rule });
	} catch (error) {
		console.error("Rules POST error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
