"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RuleFormProps {
	newRule: string;
	onNewRuleChange: (value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
	creating: boolean;
	canAddMore: boolean;
	rulesCount: number;
	maxRules: number;
	isFree: boolean;
	error: string | null;
}

export function RuleForm({
	newRule,
	onNewRuleChange,
	onSubmit,
	creating,
	canAddMore,
	rulesCount,
	maxRules,
	isFree,
	error,
}: RuleFormProps) {
	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Add New Rule</CardTitle>
				<CardDescription>
					Write your rule in natural language. The AI will apply it
					during reviews.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="space-y-4" onSubmit={onSubmit}>
					<Input
						value={newRule}
						onChange={(e) => onNewRuleChange(e.target.value)}
						placeholder="e.g. Always check for proper error handling in async functions"
						disabled={creating || !canAddMore}
					/>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">
							{rulesCount}/{maxRules} rules used
							{isFree && rulesCount >= 5 && (
								<span className="ml-2 text-primary">
									Upgrade to Pro for more rules
								</span>
							)}
						</span>
						<Button
							type="submit"
							disabled={creating || !canAddMore}
						>
							{creating ? "Adding..." : "Add Rule"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
