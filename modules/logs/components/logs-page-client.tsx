"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { LogFilters, type Repository } from "./_components/log-filters";
import { LogTable, type LogEntry } from "./_components/log-table";
import { Spinner } from "@/components/ui/spinner";

export default function LogsPageClient() {
	const { data: session } = useSession();
	const [logs, setLogs] = useState<LogEntry[]>([]);
	const [repositories, setRepositories] = useState<Repository[]>([]);
	const [initialLoading, setInitialLoading] = useState(true);
	const [typeFilter, setTypeFilter] = useState<"all" | "pr" | "issue">("all");
	const [repoFilter, setRepoFilter] = useState<string>("all");
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);

	useEffect(() => {
		if (!session) return;

		const fetchLogs = async () => {
			try {
				const params = new URLSearchParams();
				if (typeFilter !== "all") params.set("type", typeFilter);
				if (repoFilter !== "all") params.set("repoId", repoFilter);
				if (startDate) params.set("startDate", startDate.toISOString());
				if (endDate) params.set("endDate", endDate.toISOString());

				const res = await fetch(`/api/logs?${params.toString()}`);
				if (!res.ok) throw new Error("Failed to fetch logs");

				const data = await res.json();
				setLogs(data.logs);
				setRepositories(data.repositories || []);
			} catch (error) {
				console.error("Error fetching logs:", error);
			} finally {
				setInitialLoading(false);
			}
		};

		fetchLogs();
	}, [session, typeFilter, repoFilter, startDate, endDate]);

	const clearFilters = () => {
		setTypeFilter("all");
		setRepoFilter("all");
		setStartDate(undefined);
		setEndDate(undefined);
	};

	if (initialLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto">
			<div className="mb-8">
				<h1 className="text-2xl font-bold">Activity Logs</h1>
				<p className="text-muted-foreground">
					View all PR reviews and issue analyses performed by the bot
				</p>
			</div>

			<LogFilters
				typeFilter={typeFilter}
				onTypeFilterChange={setTypeFilter}
				repoFilter={repoFilter}
				onRepoFilterChange={setRepoFilter}
				repositories={repositories}
				startDate={startDate}
				onStartDateChange={setStartDate}
				endDate={endDate}
				onEndDateChange={setEndDate}
				onClearFilters={clearFilters}
			/>

			<LogTable
				logs={logs}
				hasActiveFilters={
					typeFilter !== "all" ||
					repoFilter !== "all" ||
					!!startDate ||
					!!endDate
				}
			/>
		</div>
	);
}
