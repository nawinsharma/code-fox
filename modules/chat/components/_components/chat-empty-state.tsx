"use client";

import { Card } from "@/components/ui/card";

interface ChatEmptyStateProps {
	exampleQuestions: string[];
	onSelectQuestion: (q: string) => void;
}

export function ChatEmptyState({
	exampleQuestions,
	onSelectQuestion,
}: ChatEmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center h-full">
			<h2 className="text-xl font-medium mb-2">Start a Conversation</h2>
			<p className="text-muted-foreground mb-6">
				Ask questions about your codebase
			</p>
			<div className="grid grid-cols-2 gap-3 max-w-xl">
				{exampleQuestions.map((q) => (
					<Card
						key={q}
						className="p-4 cursor-pointer hover:bg-muted transition-colors"
						onClick={() => onSelectQuestion(q)}
					>
						<p className="text-sm">{q}</p>
					</Card>
				))}
			</div>
		</div>
	);
}
