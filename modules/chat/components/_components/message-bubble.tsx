"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
	message: {
		role: "user" | "assistant";
		content: string;
	};
}

export function MessageBubble({ message }: MessageBubbleProps) {
	return (
		<div
			className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
		>
			<div
				className={`max-w-[80%] rounded-lg px-4 py-2 ${
					message.role === "user"
						? "bg-primary text-primary-foreground"
						: "bg-muted"
				}`}
			>
				{message.role === "assistant" ? (
					<div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							{message.content}
						</ReactMarkdown>
					</div>
				) : (
					<p className="whitespace-pre-wrap">{message.content}</p>
				)}
			</div>
		</div>
	);
}
