"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useUsage } from "@/components/providers/usage-provider";
import { customer, checkout } from "@/lib/auth-client";
import { AccountCard } from "./_components/account-card";
import { SubscriptionCard } from "./_components/subscription-card";
import { UsageCard } from "./_components/usage-card";
import { GithubCard } from "./_components/github-card";
import { SystemStatusCard } from "./_components/system-status-card";
import { RepositoryList } from "@/modules/settings/components/respository-list";
import { Spinner } from "@/components/ui/spinner";

const SettingsPageClient = () => {
	const { data: session } = useSession();
	const { usage, loading: usageLoading } = useUsage();
	const [loading, setLoading] = useState(false);
	const [repoName, setRepoName] = useState<string | null>(null);
	const [indexingStatus, setIndexingStatus] = useState<string | null>(null);
	const [backendStatus, setBackendStatus] = useState<
		"online" | "offline" | "degraded" | "maintenance"
	>("online");
	const [uptime, setUptime] = useState<number | null>(null);

	useEffect(() => {
		if (!session) return;

		const fetchRepo = async () => {
			try {
				const res = await fetch("/api/dashboard");
				if (res.ok) {
					const data = await res.json();
					setRepoName(data.stats?.repoName || null);
					setIndexingStatus(data.stats?.indexingStatus || null);
				}
			} catch (error) {
				console.error("Error fetching repo:", error);
			}
		};

		fetchRepo();
	}, [session]);

	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const res = await fetch("/api/status");
				const data = await res.json();
				setBackendStatus(data.status || "offline");
				if (data.uptime != null) setUptime(data.uptime);
			} catch {
				setBackendStatus("offline");
			}
		};
		fetchStatus();
	}, []);

	const handleUpgrade = async () => {
		setLoading(true);
		try {
			const result = await checkout({
				products: [
					{
						productId: "087676b3-70c9-4135-943c-5892a93a92b8",
						slug: "pro",
					},
				],
			});
			if (result?.data?.url) {
				window.location.href = result.data.url;
			}
		} catch (error) {
			console.error("Checkout error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleManageSubscription = async () => {
		setLoading(true);
		try {
			const result = await customer.portal();
			if (result?.data?.url) {
				window.location.href = result.data.url;
			}
		} catch (error) {
			console.error("Portal error:", error);
		} finally {
			setLoading(false);
		}
	};

	if (usageLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Spinner />
			</div>
		);
	}

	const isPro = usage?.plan === "PRO";
	const currentPlan = usage?.plan || "FREE";

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account and subscription
				</p>
			</div>

			<AccountCard
				name={session?.user.name}
				email={session?.user.email}
				userId={session?.user.id}
			/>

			<SubscriptionCard
				isPro={isPro}
				onUpgrade={handleUpgrade}
				onManageSubscription={handleManageSubscription}
				loading={loading}
			/>

			<UsageCard
				prsUsed={usage?.prsUsed || 0}
				prsCreated={usage?.prsCreated || 0}
				issuesUsed={usage?.issuesUsed || 0}
				chatMessagesUsed={usage?.chatMessagesUsed || 0}
				limits={{
					prs: usage?.limits[currentPlan].prs || 0,
					prsCreated: usage?.limits[currentPlan].prsCreated || 0,
					issues: usage?.limits[currentPlan].issues || 0,
					chat: usage?.limits[currentPlan].chat || 0,
				}}
			/>

			<GithubCard repoName={repoName} indexingStatus={indexingStatus} />

			<RepositoryList />

			<SystemStatusCard backendStatus={backendStatus} uptime={uptime} />
		</div>
	);
};

export default SettingsPageClient;
