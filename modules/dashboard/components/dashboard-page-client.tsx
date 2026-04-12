"use client";

import { useEffect, useState } from "react";
import {
	GitPullRequest,
	GitBranch,
	Bug,
	MessageSquare,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { useUsage } from "@/components/providers/usage-provider";
import { StatCard } from "@/modules/dashboard/components/_components/stat-card";
import { ActivityChart } from "@/modules/dashboard/components/_components/activity-chart";
import ContributionGraph from "@/modules/dashboard/components/contribution-graph";
import { Spinner } from "@/components/ui/spinner";

interface DashboardData {
	user: {
		plan: "FREE" | "PRO";
		prsUsed: number;
		prsCreated: number;
		issuesUsed: number;
		chatMessagesUsed: number;
	};
	chartData: {
		date: string;
		pullRequests: number;
		issues: number;
	}[];
	limits: {
		FREE: { prs: number; prsCreated: number; issues: number; chat: number };
		PRO: { prs: number; prsCreated: number; issues: number; chat: number };
	};
}

const DashboardPageClient = () => {
	const { data: session } = useSession();
	const { getUsagePercentage } = useUsage();
	const [data, setData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const [timeRange, setTimeRange] = useState("90d");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch("/api/dashboard");
				if (!res.ok) throw new Error("Failed to fetch");
				setData(await res.json());
			} catch (error) {
				console.error("Dashboard error:", error);
			} finally {
				setLoading(false);
			}
		};
		if (session) {
			fetchData();
		}
	}, [session]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Spinner />
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-muted-foreground">No data available</p>
			</div>
		);
	}

	const filteredChartData = data.chartData.filter((item) => {
		const date = new Date(item.date);
		const now = new Date();
		const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
		const startDate = new Date(now);
		startDate.setDate(startDate.getDate() - days);
		return date >= startDate;
	});

	const limits = data.limits[data.user.plan];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					Overview of your code review activity
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					label="PRs Reviewed"
					used={data.user.prsUsed}
					limit={limits.prs}
					percentage={getUsagePercentage("prs")}
					icon={GitPullRequest}
					accentColor="hsl(142, 60%, 45%)"
				/>
				<StatCard
					label="PRs Created"
					used={data.user.prsCreated}
					limit={limits.prsCreated}
					percentage={getUsagePercentage("prsCreated")}
					icon={GitBranch}
					accentColor="hsl(217, 70%, 55%)"
				/>
				<StatCard
					label="Issues Analyzed"
					used={data.user.issuesUsed}
					limit={limits.issues}
					percentage={getUsagePercentage("issues")}
					icon={Bug}
					accentColor="hsl(25, 85%, 55%)"
				/>
				<StatCard
					label="Chat Messages"
					used={data.user.chatMessagesUsed}
					limit={limits.chat}
					percentage={getUsagePercentage("chat")}
					icon={MessageSquare}
					accentColor="hsl(270, 60%, 55%)"
				/>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Contribution Activity</CardTitle>
					<CardDescription>
						Visualizing your coding frequency over the last year
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ContributionGraph />
				</CardContent>
			</Card>

			<ActivityChart
				chartData={filteredChartData}
				timeRange={timeRange}
				onTimeRangeChange={setTimeRange}
			/>
		</div>
	);
};

export default DashboardPageClient;
