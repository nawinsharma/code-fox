"use client";

import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
	label: string;
	used: number;
	limit: number;
	percentage: number;
	icon: LucideIcon;
	accentColor?: string;
	description?: string;
}

export function StatCard({
	label,
	used,
	limit,
	percentage,
	icon: Icon,
	accentColor = "var(--primary)",
	description,
}: StatCardProps) {
	const clampedPercentage = Math.min(percentage, 100);
	const isNearLimit = clampedPercentage >= 85;
	const remaining = Math.max(limit - used, 0);

	return (
		<div className="group relative rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-0.5">
			<div className="p-5">
				<div className="flex items-center justify-between mb-4">
					<div
						className="flex items-center justify-center w-11 h-11 rounded-xl transition-transform duration-300 group-hover:scale-110"
						style={{
							background: `linear-gradient(135deg, color-mix(in srgb, ${accentColor} 15%, transparent), color-mix(in srgb, ${accentColor} 8%, transparent))`,
							color: accentColor,
						}}
					>
						<Icon className="w-5 h-5" />
					</div>

					{isNearLimit ? (
						<span className="flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full">
							<TrendingUp className="w-3 h-3" />
							{clampedPercentage.toFixed(0)}%
						</span>
					) : (
						<span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full tabular-nums">
							{clampedPercentage.toFixed(0)}%
						</span>
					)}
				</div>

				<p className="text-sm font-medium text-muted-foreground mb-1">
					{label}
				</p>

				<div className="flex items-baseline gap-1.5 mb-1">
					<span className="text-3xl font-bold tracking-tight tabular-nums">
						{used}
					</span>
					<span className="text-sm text-muted-foreground/70 font-medium">
						/ {limit}
					</span>
				</div>

				<p className="text-xs text-muted-foreground mb-4">
					{remaining} remaining this cycle
				</p>

				{/* Progress bar */}
				<div className="w-full h-2 bg-muted/60 rounded-full overflow-hidden">
					<div
						className="h-full rounded-full transition-all duration-700 ease-out"
						style={{
							width: `${clampedPercentage}%`,
							background: isNearLimit
								? "var(--destructive)"
								: `linear-gradient(90deg, ${accentColor}, color-mix(in srgb, ${accentColor} 70%, white))`,
						}}
					/>
				</div>
			</div>
		</div>
	);
}
