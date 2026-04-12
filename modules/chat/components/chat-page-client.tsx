"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useUsage } from "@/components/providers/usage-provider";
import { MessageBubble } from "./_components/message-bubble";
import { ChatEmptyState } from "./_components/chat-empty-state";
import Link from "next/link";

interface Message {
	role: "user" | "assistant";
	content: string;
}

const exampleQuestions = [
	"How is authentication handled?",
	"What are the main API endpoints?",
	"How is the code review system structured?",
	"How are usage limits enforced?",
];

export default function ChatPageClient() {
	const { canSendMessage, getRemainingMessages, refreshUsage } = useUsage();
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const userMessage = input.trim();
		if (!userMessage) return;

		if (!canSendMessage()) {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content:
						"You have reached your message limit. Upgrade to Pro for more messages.",
				},
			]);
			return;
		}

		setInput("");
		setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
		setLoading(true);

		try {
			const res = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ question: userMessage }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to get response");

			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: data.answer },
			]);
			refreshUsage();
		} catch {
			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: "Something went wrong. Please try again." },
			]);
		} finally {
			setLoading(false);
		}
	};

	const canChat = canSendMessage();

	return (
		<div className="flex flex-col h-[calc(100vh-4rem)]">
			<div className="flex-1 overflow-y-auto p-4">
				<div className="max-w-3xl mx-auto space-y-4 h-full">
					{messages.length === 0 ? (
						<ChatEmptyState
							exampleQuestions={exampleQuestions}
							onSelectQuestion={(q) => setInput(q)}
						/>
					) : (
						messages.map((message, index) => (
							<MessageBubble key={index} message={message} />
						))
					)}

					{loading && (
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
							onChange={(e) => setInput(e.target.value)}
							onSubmit={handleSubmit}
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
