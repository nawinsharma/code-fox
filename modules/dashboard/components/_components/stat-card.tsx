"use client";

import type { LucideIcon } from "lucide-react";

interface StatCardProps {
	label: string;
	used: number;
	limit: number;
	percentage: number;
	icon: LucideIcon;
	accentColor?: string;
}

export function StatCard({
	label,
	used,
	limit,
	percentage,
	icon: Icon,
	accentColor = "var(--primary)",
}: StatCardProps) {
	const clampedPercentage = Math.min(percentage, 100);
	const isNearLimit = clampedPercentage >= 85;

	return (
		<div className="group relative rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-md hover:border-border/80">
			<div className="flex items-start justify-between mb-4">
				<div
					className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200"
					style={{
						backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
						color: accentColor,
					}}
				>
					<Icon className="w-5 h-5" />
				</div>
				<span className="text-xs font-medium text-muted-foreground tabular-nums">
					{clampedPercentage.toFixed(0)}%
				</span>
			</div>

			<p className="text-sm text-muted-foreground mb-1">{label}</p>

			<div className="flex items-baseline gap-1 mb-4">
				<span className="text-2xl font-bold tracking-tight tabular-nums">
					{used}
				</span>
				<span className="text-sm text-muted-foreground font-medium">
					/ {limit}
				</span>
			</div>

			<div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
				<div
					className="h-full rounded-full transition-all duration-500 ease-out"
					style={{
						width: `${clampedPercentage}%`,
						backgroundColor: isNearLimit
							? "var(--destructive)"
							: accentColor,
					}}
				/>
			</div>
		</div>
	);
}
