"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Activity } from "lucide-react";

const chartConfig = {
	pullRequests: { label: "Pull Requests", color: "var(--chart-1)" },
	issues: { label: "Issues", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface ActivityChartProps {
	chartData: { date: string; pullRequests: number; issues: number }[];
	timeRange: string;
	onTimeRangeChange: (value: string) => void;
}

export function ActivityChart({
	chartData,
	timeRange,
	onTimeRangeChange,
}: ActivityChartProps) {
	const totalPRs = chartData.reduce((sum, d) => sum + d.pullRequests, 0);
	const totalIssues = chartData.reduce((sum, d) => sum + d.issues, 0);

	return (
		<div className="rounded-2xl border bg-card overflow-hidden">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 pb-2">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
						<Activity className="w-4.5 h-4.5" />
					</div>
					<div>
						<h3 className="text-sm font-semibold">Activity Overview</h3>
						<p className="text-xs text-muted-foreground">
							PRs and issues analyzed over time
						</p>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<div className="hidden sm:flex items-center gap-3 text-xs">
						<div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-full">
							<span className="w-2 h-2 rounded-full bg-[var(--chart-1)]" />
							<span className="font-semibold text-foreground tabular-nums">
								{totalPRs}
							</span>
							<span className="text-muted-foreground">PRs</span>
						</div>
						<div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-full">
							<span className="w-2 h-2 rounded-full bg-[var(--chart-2)]" />
							<span className="font-semibold text-foreground tabular-nums">
								{totalIssues}
							</span>
							<span className="text-muted-foreground">Issues</span>
						</div>
					</div>
					<Select value={timeRange} onValueChange={onTimeRangeChange}>
						<SelectTrigger className="w-36 h-8 text-xs rounded-lg">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="90d">Last 3 months</SelectItem>
							<SelectItem value="30d">Last 30 days</SelectItem>
							<SelectItem value="7d">Last 7 days</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="px-6 pb-6 pt-2">
				<ChartContainer config={chartConfig} className="h-72 w-full aspect-auto min-w-0">
					<AreaChart
						data={chartData}
						margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
					>
						<defs>
							<linearGradient
								id="fillPRs"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="0%"
									stopColor="var(--chart-1)"
									stopOpacity={0.25}
								/>
								<stop
									offset="100%"
									stopColor="var(--chart-1)"
									stopOpacity={0.01}
								/>
							</linearGradient>
							<linearGradient
								id="fillIssues"
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="0%"
									stopColor="var(--chart-2)"
									stopOpacity={0.25}
								/>
								<stop
									offset="100%"
									stopColor="var(--chart-2)"
									stopOpacity={0.01}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							vertical={false}
							strokeDasharray="3 3"
							stroke="var(--border)"
							strokeOpacity={0.4}
						/>
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={12}
							minTickGap={48}
							tick={{
								fontSize: 11,
								fill: "var(--muted-foreground)",
							}}
							tickFormatter={(value) => {
								const date = new Date(value + "T00:00:00");
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tick={{
								fontSize: 11,
								fill: "var(--muted-foreground)",
							}}
							allowDecimals={false}
							width={32}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									indicator="dot"
									labelFormatter={(value) => {
										const date = new Date(
											value + "T00:00:00",
										);
										return date.toLocaleDateString(
											"en-US",
											{
												weekday: "short",
												month: "short",
												day: "numeric",
											},
										);
									}}
								/>
							}
						/>
						<Area
							dataKey="issues"
							type="monotone"
							fill="url(#fillIssues)"
							stroke="var(--chart-2)"
							strokeWidth={2}
							stackId="a"
						/>
						<Area
							dataKey="pullRequests"
							type="monotone"
							fill="url(#fillPRs)"
							stroke="var(--chart-1)"
							strokeWidth={2}
							stackId="a"
						/>
						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</div>
		</div>
	);
}
