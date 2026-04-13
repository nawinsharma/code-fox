"use client";

import { useState } from "react";
import {
	GitPullRequest,
	GitBranch,
	Bug,
	MessageSquare,
	Zap,
	ArrowRight,
	Crown,
	Sparkles,
	GitFork,
	Calendar,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { useUsage, DASHBOARD_QUERY_KEY } from "@/components/providers/usage-provider";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/modules/dashboard/components/_components/stat-card";
import { ActivityChart } from "@/modules/dashboard/components/_components/activity-chart";
import ContributionGraph from "@/modules/dashboard/components/contribution-graph";
import Link from "next/link";

interface DashboardData {
	user: {
		name: string;
		email: string;
		plan: "FREE" | "PRO";
		prsUsed: number;
		prsCreated: number;
		issuesUsed: number;
		chatMessagesUsed: number;
	};
	stats: {
		totalPRs: number;
		totalIssues: number;
		repoCount: number;
		repoName: string | null;
		indexingStatus: string;
		githubAccount: string | null;
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

function DashboardSkeleton() {
	return (
		<div className="space-y-8">
			{/* Welcome skeleton */}
			<div className="flex items-center gap-4">
				<Skeleton className="w-14 h-14 rounded-2xl" />
				<div className="space-y-2">
					<Skeleton className="h-7 w-48" />
					<Skeleton className="h-4 w-64" />
				</div>
			</div>

			{/* Stat cards skeleton */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="rounded-2xl border bg-card p-5 space-y-4">
						<div className="flex justify-between">
							<Skeleton className="w-11 h-11 rounded-xl" />
							<Skeleton className="w-12 h-6 rounded-full" />
						</div>
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-8 w-20" />
						<Skeleton className="h-2 w-full rounded-full" />
					</div>
				))}
			</div>

			{/* Chart skeleton */}
			<Skeleton className="h-80 w-full rounded-xl" />

			{/* Contribution skeleton */}
			<Skeleton className="h-48 w-full rounded-xl" />
		</div>
	);
}

const DashboardPageClient = () => {
	const { data: session } = useSession();
	const { getUsagePercentage } = useUsage();
	const [timeRange, setTimeRange] = useState("90d");

	const { data, isLoading, isPending } = useQuery<DashboardData>({
		queryKey: DASHBOARD_QUERY_KEY,
		queryFn: async () => {
			const res = await fetch("/api/dashboard");
			if (!res.ok) throw new Error("Failed to fetch");
			return res.json();
		},
		enabled: !!session,
	});

	if (isLoading || isPending) {
		return <DashboardSkeleton />;
	}

	if (!data) {
		return (
			<div className="flex flex-col items-center justify-center h-64 gap-3">
				<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
					<Bug className="w-6 h-6 text-muted-foreground" />
				</div>
				<p className="text-muted-foreground font-medium">
					Unable to load dashboard data
				</p>
				<Button
					variant="outline"
					size="sm"
					onClick={() => window.location.reload()}
				>
					Try again
				</Button>
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
	const isPro = data.user.plan === "PRO";
	const userName = session?.user?.name || "there";
	const userAvatar = session?.user?.image || "";
	const userInitials = userName
		.split(" ")
		.map((s) => s[0])
		.join("")
		.toUpperCase();

	const hour = new Date().getHours();
	const greeting =
		hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

	return (
		<div className="space-y-8">
			{/* ── Welcome Header ── */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<Avatar className="w-14 h-14 rounded-2xl border-2 border-border">
						<AvatarImage src={userAvatar} alt={userName} />
						<AvatarFallback className="rounded-2xl text-lg font-bold bg-primary/10 text-primary">
							{userInitials}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className="flex items-center gap-2.5">
							<h1 className="text-2xl font-bold tracking-tight">
								{greeting}, {userName.split(" ")[0]}
							</h1>
							<Badge
								variant={isPro ? "default" : "secondary"}
								className="gap-1"
							>
								{isPro ? (
									<Crown className="w-3 h-3" />
								) : (
									<Sparkles className="w-3 h-3" />
								)}
								{isPro ? "Pro" : "Free"}
							</Badge>
						</div>
						<p className="text-sm text-muted-foreground mt-0.5">
							Here&apos;s your coding activity overview
						</p>
					</div>
				</div>

				{!isPro && (
					<Link href="/dashboard/subscriptions">
						<Button size="sm" className="gap-2">
							<Zap className="w-4 h-4" />
							Upgrade to Pro
							<ArrowRight className="w-3.5 h-3.5" />
						</Button>
					</Link>
				)}
			</div>

			{/* ── Quick Summary Chips ── */}
			<div className="flex flex-wrap gap-3">
				<div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
					<GitFork className="w-4 h-4 text-muted-foreground" />
					<span className="font-semibold tabular-nums">
						{data.stats.repoCount}
					</span>
					<span className="text-muted-foreground">
						{data.stats.repoCount === 1 ? "Repository" : "Repositories"}
					</span>
				</div>
				<div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
					<GitPullRequest className="w-4 h-4 text-muted-foreground" />
					<span className="font-semibold tabular-nums">
						{data.stats.totalPRs}
					</span>
					<span className="text-muted-foreground">Total PRs</span>
				</div>
				<div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
					<Bug className="w-4 h-4 text-muted-foreground" />
					<span className="font-semibold tabular-nums">
						{data.stats.totalIssues}
					</span>
					<span className="text-muted-foreground">Total Issues</span>
				</div>
			</div>

			{/* ── Usage Stat Cards ── */}
			<div>
				<h2 className="text-lg font-semibold mb-4">Usage This Cycle</h2>
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
			</div>

			{/* ── Activity Chart ── */}
			<div>
				<h2 className="text-lg font-semibold mb-4">Activity</h2>
				<ActivityChart
					chartData={filteredChartData}
					timeRange={timeRange}
					onTimeRangeChange={setTimeRange}
				/>
			</div>

			{/* ── Contribution Activity (Last) ── */}
			<div>
				<Card className="overflow-hidden">
					<CardHeader className="pb-2">
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500">
								<Calendar className="w-4.5 h-4.5" />
							</div>
							<div>
								<CardTitle className="text-sm font-semibold">
									Contribution Activity
								</CardTitle>
								<CardDescription>
									Your coding frequency over the last year
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="pt-2">
						<ContributionGraph />
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default DashboardPageClient;
