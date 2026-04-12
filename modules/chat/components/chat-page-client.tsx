"use client";

import { useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useUsage } from "@/components/providers/usage-provider";
import { MessageBubble } from "./_components/message-bubble";
import { ChatEmptyState } from "./_components/chat-empty-state";
import Link from "next/link";

const exampleQuestions = [
	"How is authentication handled?",
	"What are the main API endpoints?",
	"How is the code review system structured?",
	"How are usage limits enforced?",
];

export default function ChatPageClient() {
	const { canSendMessage, getRemainingMessages, refreshUsage } = useUsage();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef("");

	const { messages, status, sendMessage } = useChat({
		onFinish: () => {
			refreshUsage();
		},
		onError: () => {
			// Error handled by useChat
		},
	});

	const isLoading = status === "submitted" || status === "streaming";

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const onFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const text = inputRef.current.trim();
		if (!text || !canSendMessage()) return;

		sendMessage({ text });
		inputRef.current = "";
	};

	const onSelectQuestion = (q: string) => {
		if (!canSendMessage()) return;
		sendMessage({ text: q });
	};

	const canChat = canSendMessage();

	return (
		<div className="flex flex-col h-[calc(100vh-4rem)]">
			<div className="flex-1 overflow-y-auto p-4">
				<div className="max-w-3xl mx-auto space-y-4 h-full">
					{messages.length === 0 ? (
						<ChatEmptyState
							exampleQuestions={exampleQuestions}
							onSelectQuestion={onSelectQuestion}
						/>
					) : (
						messages.map((message) => {
							const textContent = message.parts
								.filter(
									(p): p is { type: "text"; text: string } =>
										p.type === "text",
								)
								.map((p) => p.text)
								.join("");

							return (
								<MessageBubble
									key={message.id}
									message={{
										role: message.role as "user" | "assistant",
										content: textContent,
									}}
								/>
							);
						})
					)}

					{isLoading &&
						messages[messages.length - 1]?.role === "user" && (
							<div className="flex justify-start">
								<div className="bg-muted rounded-lg px-4 py-2">
									<div className="flex gap-1">
										<span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
										<span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
										<span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
									</div>
								</div>
							</div>
						)}
					<div ref={messagesEndRef} />
				</div>
			</div>

			<div className="border-t p-4">
				<div className="max-w-3xl mx-auto">
					{!canChat ? (
						<div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-center">
							<p className="text-amber-800 dark:text-amber-200 mb-2">
								You have reached your message limit
							</p>
							<Link href="/dashboard/subscriptions">
								<Button>Upgrade to Pro</Button>
							</Link>
						</div>
					) : (
						<PlaceholdersAndVanishInput
							placeholders={exampleQuestions}
							onChange={(e) => {
								inputRef.current = e.target.value;
							}}
							onSubmit={onFormSubmit}
						/>
					)}
					{canChat && (
						<p className="text-xs text-muted-foreground mt-2 text-center">
							{getRemainingMessages()} messages remaining
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
