"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface UsageCardProps {
	prsUsed: number;
	prsCreated: number;
	issuesUsed: number;
	chatMessagesUsed: number;
	limits: {
		prs: number;
		prsCreated: number;
		issues: number;
		chat: number;
	};
}

function ProgressBar({
	label,
	used,
	limit,
}: {
	label: string;
	used: number;
	limit: number;
}) {
	return (
		<div>
			<div className="flex justify-between mb-1">
				<span className="text-sm">{label}</span>
				<span className="text-sm text-muted-foreground">
					{used}/{limit}
				</span>
			</div>
			<div className="w-full bg-muted rounded-full h-2">
				<div
					className="bg-primary h-2 rounded-full transition-all"
					style={{
						width: `${Math.min((used / (limit || 1)) * 100, 100)}%`,
					}}
				/>
			</div>
		</div>
	);
}

export function UsageCard({
	prsUsed,
	prsCreated,
	issuesUsed,
	chatMessagesUsed,
	limits,
}: UsageCardProps) {
	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Usage This Month</CardTitle>
				<CardDescription>
					Your usage resets monthly from your signup date
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<ProgressBar
						label="PR Reviews"
						used={prsUsed}
						limit={limits.prs}
					/>
					<ProgressBar
						label="PRs Created"
						used={prsCreated}
						limit={limits.prsCreated}
					/>
					<ProgressBar
						label="Issue Analyses"
						used={issuesUsed}
						limit={limits.issues}
					/>
					<ProgressBar
						label="Chat Messages"
						used={chatMessagesUsed}
						limit={limits.chat}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
