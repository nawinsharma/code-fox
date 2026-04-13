"use client";

import { format } from "date-fns";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export interface LogEntry {
	id: string;
	type: "pr" | "issue";
	number: number;
	title: string;
	repository: string;
	date: string;
}

interface LogTableProps {
	logs: LogEntry[];
	hasActiveFilters: boolean;
}

export function LogTable({ logs, hasActiveFilters }: LogTableProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Logs</CardTitle>
						<CardDescription>
							{logs.length} entries found
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{logs.length === 0 ? (
					<div className="text-center py-12 text-muted-foreground">
						<p className="text-lg mb-2">No logs found</p>
						<p className="text-sm">
							{hasActiveFilters
								? "Try adjusting your filters"
								: "Logs will appear here once the bot reviews PRs or analyzes issues"}
						</p>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Type</TableHead>
								<TableHead>Number</TableHead>
								<TableHead>Title</TableHead>
								<TableHead>Repository</TableHead>
								<TableHead>Date</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{logs.map((log) => (
								<TableRow key={log.id}>
									<TableCell>
										<span
											className={`px-2 py-1 rounded text-xs font-medium ${
												log.type === "pr"
													? "bg-primary/10 text-primary"
													: "bg-muted text-muted-foreground"
											}`}
										>
											{log.type === "pr"
												? "PR"
												: "Issue"}
										</span>
									</TableCell>
									<TableCell className="font-mono">
										#{log.number}
									</TableCell>
									<TableCell className="max-w-[300px] truncate">
										{log.title}
									</TableCell>
									<TableCell className="text-muted-foreground">
										{log.repository}
									</TableCell>
									<TableCell className="text-muted-foreground">
										{format(
											new Date(log.date),
											"MMM d, yyyy h:mm a",
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}
