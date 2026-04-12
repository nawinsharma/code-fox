"use client";

import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";

import { getContributionStats } from "@/modules/dashboard/actions";

const ContributionGraph = () => {
	const { theme } = useTheme();

	const { data, isLoading } = useQuery({
		queryKey: ["contribution-graph"],
		queryFn: getContributionStats,
	});

	if (isLoading) {
		return (
			<div className="w-full flex flex-col items-center justify-center p-8">
				<div className="animate-pulse text-muted-foreground">
					Loading contribution data...
				</div>
			</div>
		);
	}

	if (!data || !data.contributions.length) {
		return (
			<div className="w-full flex flex-col items-center justify-center p-8">
				<div className="text-muted-foreground">
					No contribution data available
				</div>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col items-center gap-4">
			<div className="text-sm text-muted-foreground">
				<span className="font-semibold text-foreground">
					{data.totalContributions}
				</span>{" "}
				contributions in last year
			</div>

			<div className="w-full overflow-x-auto flex justify-center">
				<ActivityCalendar
					data={data.contributions}
					colorScheme={theme === "dark" ? "dark" : "light"}
					blockSize={18}
					blockMargin={6}
					fontSize={16}
					showWeekdayLabels
					showMonthLabels
					theme={{
						light: ["hsl(0, 0%, 92%)", "hsl(142, 71%, 45%)"],
						dark: ["#161b22", "hsl(142, 71%, 45%)"],
					}}
				/>
			</div>
		</div>
	);
};

export default ContributionGraph;
