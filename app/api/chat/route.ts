import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { PLAN_LIMITS, type PlanType } from "@/lib/plan-limits";

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { question } = await req.json();

		if (!question) {
			return NextResponse.json(
				{ error: "Question is required" },
				{ status: 400 },
			);
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				subscriptionTier: true,
				chatMessagesUsed: true,
			},
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const plan = user.subscriptionTier as PlanType;
		const limit = PLAN_LIMITS[plan].chat;

		if (user.chatMessagesUsed >= limit) {
			return NextResponse.json(
				{ error: "Chat message limit reached. Upgrade to Pro for more messages." },
				{ status: 403 },
			);
		}

		const repo = await prisma.repository.findFirst({
			where: { userId: session.user.id },
			select: { fullName: true },
		});

		// TODO: Integrate with vector DB backend for RAG chat
		// For now, return a placeholder response
		const answer = `I received your question about: "${question}". RAG-based codebase chat will be available once the vector database backend is connected. This will search your indexed repository${repo ? ` (${repo.fullName})` : ""} for relevant code context.`;

		await prisma.user.update({
			where: { id: session.user.id },
			data: { chatMessagesUsed: { increment: 1 } },
		});

		return NextResponse.json({ answer });
	} catch (error) {
		console.error("Chat API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
