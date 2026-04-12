"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useUsage } from "@/components/providers/usage-provider";
import { RuleForm } from "./_components/rule-form";
import { RuleList, type Rule } from "./_components/rule-list";
import { Spinner } from "@/components/ui/spinner";

export default function RulesPageClient() {
	const { data: session } = useSession();
	const { usage } = useUsage();
	const [rules, setRules] = useState<Rule[]>([]);
	const [loading, setLoading] = useState(true);
	const [newRule, setNewRule] = useState("");
	const [creating, setCreating] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editContent, setEditContent] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (session) {
			fetchRules();
		}
	}, [session]);

	const fetchRules = async () => {
		try {
			const res = await fetch("/api/rules");
			if (!res.ok) throw new Error("Failed to fetch rules");
			const data = await res.json();
			setRules(data.rules);
		} catch (err) {
			console.error("Error fetching rules:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newRule.trim()) return;

		setCreating(true);
		setError(null);

		try {
			const res = await fetch("/api/rules", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: newRule }),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "Failed to create rule");
				return;
			}

			setRules([data.rule, ...rules]);
			setNewRule("");
		} catch {
			setError("Failed to create rule");
		} finally {
			setCreating(false);
		}
	};

	const handleUpdate = async (id: string) => {
		if (!editContent.trim()) return;

		try {
			const res = await fetch(`/api/rules/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: editContent }),
			});

			if (!res.ok) throw new Error("Failed to update rule");

			const data = await res.json();
			setRules(rules.map((r) => (r.id === id ? data.rule : r)));
			setEditingId(null);
			setEditContent("");
		} catch (err) {
			console.error("Error updating rule:", err);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this rule?")) return;

		try {
			const res = await fetch(`/api/rules/${id}`, { method: "DELETE" });
			if (!res.ok) throw new Error("Failed to delete rule");
			setRules(rules.filter((r) => r.id !== id));
		} catch (err) {
			console.error("Error deleting rule:", err);
		}
	};

	const startEditing = (rule: Rule) => {
		setEditingId(rule.id);
		setEditContent(rule.content);
	};

	const cancelEditing = () => {
		setEditingId(null);
		setEditContent("");
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Spinner />
			</div>
		);
	}

	const maxRules = usage?.plan === "PRO" ? 50 : 5;
	const canAddMore = rules.length < maxRules;

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<h1 className="text-2xl font-bold">Custom Rules</h1>
				<p className="text-muted-foreground">
					Define rules in plain English. The AI will use these when
					reviewing your code.
				</p>
			</div>

			<RuleForm
				newRule={newRule}
				onNewRuleChange={setNewRule}
				onSubmit={handleCreate}
				creating={creating}
				canAddMore={canAddMore}
				rulesCount={rules.length}
				maxRules={maxRules}
				isFree={usage?.plan !== "PRO"}
				error={error}
			/>

			<RuleList
				rules={rules}
				editingId={editingId}
				editContent={editContent}
				onEditContentChange={setEditContent}
				onStartEditing={startEditing}
				onCancelEditing={cancelEditing}
				onUpdate={handleUpdate}
				onDelete={handleDelete}
			/>
		</div>
	);
}
