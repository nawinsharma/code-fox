"use client";

import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

import { getContributionStats } from "@/modules/dashboard/actions";

const ContributionGraph = () => {
	const { theme } = useTheme();

	const { data, isLoading } = useQuery({
		queryKey: ["contribution-graph"],
		queryFn: getContributionStats,
	});

	if (isLoading) {
		return (
			<div className="w-full space-y-3 py-4">
				<Skeleton className="h-4 w-48 mx-auto" />
				<Skeleton className="h-32 w-full rounded-lg" />
			</div>
		);
	}

	if (!data || !data.contributions.length) {
		return (
			<div className="w-full flex flex-col items-center justify-center py-8">
				<p className="text-sm text-muted-foreground">
					No contribution data available
				</p>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col items-center gap-4 py-2">
			<div className="flex items-center gap-2 text-sm">
				<span className="text-2xl font-bold text-foreground tabular-nums">
					{data.totalContributions}
				</span>
				<span className="text-muted-foreground">
					contributions in the last year
				</span>
			</div>

			<div className="w-full overflow-x-auto flex justify-center">
				<ActivityCalendar
					data={data.contributions}
					colorScheme={theme === "dark" ? "dark" : "light"}
					blockSize={14}
					blockMargin={4}
					fontSize={14}
					showWeekdayLabels
					showMonthLabels
					theme={{
						light: [
							"hsl(0, 0%, 93%)",
							"hsl(142, 50%, 80%)",
							"hsl(142, 55%, 65%)",
							"hsl(142, 60%, 48%)",
							"hsl(142, 70%, 35%)",
						],
						dark: [
							"hsl(0, 0%, 14%)",
							"hsl(142, 40%, 22%)",
							"hsl(142, 50%, 32%)",
							"hsl(142, 60%, 42%)",
							"hsl(142, 71%, 45%)",
						],
					}}
				/>
			</div>
		</div>
	);
};

export default ContributionGraph;
