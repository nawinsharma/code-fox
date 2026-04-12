"use client";

import {
	createContext,
	useContext,
	useCallback,
	type ReactNode,
} from "react";
import { useSession } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface UsageLimits {
	prs: number;
	prsCreated: number;
	issues: number;
	chat: number;
}

interface UsageData {
	plan: "FREE" | "PRO";
	prsUsed: number;
	prsCreated: number;
	issuesUsed: number;
	chatMessagesUsed: number;
	billingCycleStart: string;
	githubAccount: string | null;
	limits: {
		FREE: UsageLimits;
		PRO: UsageLimits;
	};
}

type UsageType = "prs" | "prsCreated" | "issues" | "chat";

interface UsageContextType {
	usage: UsageData | null;
	loading: boolean;
	error: string | null;
	refreshUsage: () => Promise<void>;
	canSendMessage: () => boolean;
	getRemainingMessages: () => number;
	getUsagePercentage: (type: UsageType) => number;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

async function fetchDashboard() {
	const res = await fetch("/api/dashboard");
	if (!res.ok) throw new Error("Failed to fetch dashboard");
	return res.json();
}

export const DASHBOARD_QUERY_KEY = ["dashboard"] as const;

export function UsageProvider({ children }: { children: ReactNode }) {
	const { data: session, isPending } = useSession();
	const queryClient = useQueryClient();

	const { data: dashboardData, isLoading, error: queryError } = useQuery({
		queryKey: DASHBOARD_QUERY_KEY,
		queryFn: fetchDashboard,
		enabled: !isPending && !!session,
	});

	const usage: UsageData | null = dashboardData
		? {
				plan: dashboardData.user.plan,
				prsUsed: dashboardData.user.prsUsed,
				prsCreated: dashboardData.user.prsCreated,
				issuesUsed: dashboardData.user.issuesUsed,
				chatMessagesUsed: dashboardData.user.chatMessagesUsed,
				billingCycleStart: dashboardData.user.billingCycleStart,
				githubAccount: dashboardData.stats?.githubAccount || null,
				limits: dashboardData.limits,
			}
		: null;

	const loading = isPending || isLoading;

	const refreshUsage = useCallback(async () => {
		await queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
	}, [queryClient]);

	const canSendMessage = useCallback(() => {
		if (!usage) return false;
		const limit = usage.limits[usage.plan].chat;
		return usage.chatMessagesUsed < limit;
	}, [usage]);

	const getRemainingMessages = useCallback(() => {
		if (!usage) return 0;
		const limit = usage.limits[usage.plan].chat;
		return limit - usage.chatMessagesUsed;
	}, [usage]);

	const getUsagePercentage = useCallback(
		(type: UsageType) => {
			if (!usage) return 0;

			let used: number;
			let limit: number;

			if (type === "prs") {
				used = usage.prsUsed;
				limit = usage.limits[usage.plan].prs;
			} else if (type === "prsCreated") {
				used = usage.prsCreated;
				limit = usage.limits[usage.plan].prsCreated;
			} else if (type === "issues") {
				used = usage.issuesUsed;
				limit = usage.limits[usage.plan].issues;
			} else {
				used = usage.chatMessagesUsed;
				limit = usage.limits[usage.plan].chat;
			}

			return (used / limit) * 100;
		},
		[usage],
	);

	return (
		<UsageContext.Provider
			value={{
				usage,
				loading,
				error: queryError?.message || null,
				refreshUsage,
				canSendMessage,
				getRemainingMessages,
				getUsagePercentage,
			}}
		>
			{children}
		</UsageContext.Provider>
	);
}

export function useUsage() {
	const context = useContext(UsageContext);
	if (context === undefined) {
		throw new Error("useUsage must be used within a UsageProvider");
	}
	return context;
}
