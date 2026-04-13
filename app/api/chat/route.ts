import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";
import { PLAN_LIMITS, type PlanType } from "@/lib/plan-limits";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { retrieveContext } from "@/modules/ai/lib/rag";

export async function POST(req: NextRequest) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await req.json();
		const messages: UIMessage[] = body.messages;

		if (!messages || messages.length === 0) {
			return NextResponse.json(
				{ error: "Messages are required" },
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
				{
					error:
						"Chat message limit reached. Upgrade to Pro for more messages.",
				},
				{ status: 403 },
			);
		}

		const repo = await prisma.repository.findFirst({
			where: { userId: session.user.id },
			select: { fullName: true },
		});

		// Extract the last user message text for RAG retrieval
		const lastUserMessage = [...messages]
			.reverse()
			.find((m) => m.role === "user");
		const lastUserText = lastUserMessage?.parts
			?.filter((p): p is { type: "text"; text: string } => p.type === "text")
			.map((p) => p.text)
			.join(" ");

		let context = "";
		if (repo && lastUserText) {
			try {
				const snippets = await retrieveContext(
					lastUserText,
					repo.fullName,
					5,
				);
				if (snippets.length > 0) {
					context = `\n\nRelevant code from the repository (${repo.fullName}):\n\n${snippets.join("\n\n---\n\n")}`;
				}
			} catch {
				// RAG retrieval failed — continue without context
			}
		}

		const modelMessages = await convertToModelMessages(messages);

		const result = streamText({
			model: anthropic("claude-sonnet-4-6-20250514"),
			system: `You are CodeFox AI, a helpful coding assistant that answers questions about the user's codebase.${repo ? ` The user's repository is ${repo.fullName}.` : ""} Be concise, accurate, and reference specific files/functions when possible. Use markdown formatting for code blocks and structured answers.${context}`,
			messages: modelMessages,
			onFinish: async () => {
				await prisma.user.update({
					where: { id: session.user.id },
					data: { chatMessagesUsed: { increment: 1 } },
				});
			},
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error("Chat API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
