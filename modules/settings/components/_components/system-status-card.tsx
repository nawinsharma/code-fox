"use client";

interface SystemStatusCardProps {
	backendStatus: "online" | "offline" | "degraded" | "maintenance";
	uptime: number | null;
}

export function SystemStatusCard({
	backendStatus,
	uptime,
}: SystemStatusCardProps) {
	const statusConfig = {
		online: {
			color: "bg-green-500",
			label: "All systems operational",
		},
		offline: {
			color: "bg-red-500",
			label: "System down",
		},
		degraded: {
			color: "bg-yellow-500",
			label: "System degraded",
		},
		maintenance: {
			color: "bg-blue-500",
			label: "Under maintenance",
		},
	};

	const config = statusConfig[backendStatus];

	return (
		<div className="flex items-center justify-center gap-3 mt-6">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<span
					className={`w-2 h-2 rounded-full ${config.color}`}
				/>
				<span>{config.label}</span>
			</div>
			{uptime !== null && (
				<span className="text-xs text-muted-foreground">
					{uptime}% uptime
				</span>
			)}
		</div>
	);
}
