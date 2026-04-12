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

export interface Rule {
	id: string;
	content: string;
	createdAt: string;
}

interface RuleListProps {
	rules: Rule[];
	editingId: string | null;
	editContent: string;
	onEditContentChange: (value: string) => void;
	onStartEditing: (rule: Rule) => void;
	onCancelEditing: () => void;
	onUpdate: (id: string) => void;
	onDelete: (id: string) => void;
}

export function RuleList({
	rules,
	editingId,
	editContent,
	onEditContentChange,
	onStartEditing,
	onCancelEditing,
	onUpdate,
	onDelete,
}: RuleListProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Rules</CardTitle>
				<CardDescription>
					These rules will be applied to all AI reviews
				</CardDescription>
			</CardHeader>
			<CardContent>
				{rules.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<p className="mb-2">No rules defined yet</p>
						<p className="text-sm">
							Add your first rule above to get started
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{rules.map((rule) => (
							<div
								key={rule.id}
								className="flex items-start gap-3 p-4 border rounded-lg bg-muted/50"
							>
								{editingId === rule.id ? (
									<div className="flex-1 space-y-2">
										<Input
											value={editContent}
											onChange={(e) =>
												onEditContentChange(
													e.target.value,
												)
											}
											autoFocus
										/>
										<div className="flex gap-2">
											<Button
												size="sm"
												onClick={() =>
													onUpdate(rule.id)
												}
												disabled={
													!editContent.trim()
												}
											>
												Save
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={onCancelEditing}
											>
												Cancel
											</Button>
										</div>
									</div>
								) : (
									<>
										<div className="flex-1">
											<p>{rule.content}</p>
										</div>
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													onStartEditing(rule)
												}
											>
												Edit
											</Button>
											<Button
												size="sm"
												variant="outline"
												className="text-red-600 hover:text-red-700 hover:bg-red-50"
												onClick={() =>
													onDelete(rule.id)
												}
											>
												Delete
											</Button>
										</div>
									</>
								)}
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
