"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SubscriptionCardProps {
	isPro: boolean;
	onUpgrade: () => void;
	onManageSubscription: () => void;
	loading: boolean;
}

export function SubscriptionCard({
	isPro,
	onUpgrade,
	onManageSubscription,
	loading,
}: SubscriptionCardProps) {
	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Subscription</CardTitle>
				<CardDescription>
					Your current plan and billing
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between mb-6">
					<div>
						<p className="text-lg font-semibold">
							{isPro ? "Pro Plan" : "Free Plan"}
						</p>
						<p className="text-muted-foreground text-sm">
							{isPro
								? "150 PR reviews, 50 auto-PRs, 200 issues, 1000 chat messages"
								: "10 PR reviews, 5 auto-PRs, 20 issues, 50 chat messages"}
						</p>
					</div>
					<div
						className={`px-3 py-1 rounded-full text-sm font-medium ${
							isPro
								? "bg-primary/10 text-primary"
								: "bg-muted text-muted-foreground"
						}`}
					>
						{isPro ? "PRO" : "FREE"}
					</div>
				</div>

				{isPro ? (
					<Button
						variant="outline"
						onClick={onManageSubscription}
						disabled={loading}
					>
						Manage Subscription
					</Button>
				) : (
					<div className="space-y-4">
						<div className="p-4 border rounded-lg bg-primary/5">
							<h3 className="font-semibold mb-2">
								Upgrade to Pro
							</h3>
							<ul className="text-sm text-muted-foreground space-y-1 mb-4">
								<li>150 PR reviews per month</li>
								<li>50 auto-PRs created per month</li>
								<li>200 issues analyzed per month</li>
								<li>1000 chat messages per month</li>
								<li>Priority support</li>
							</ul>
							<Button
								onClick={onUpgrade}
								disabled={loading}
							>
								{loading ? "Loading..." : "Upgrade to Pro"}
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
