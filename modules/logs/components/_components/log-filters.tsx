"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export interface Repository {
	id: string;
	fullName: string;
}

interface LogFiltersProps {
	typeFilter: "all" | "pr" | "issue";
	onTypeFilterChange: (value: "all" | "pr" | "issue") => void;
	repoFilter: string;
	onRepoFilterChange: (value: string) => void;
	repositories: Repository[];
	startDate: Date | undefined;
	onStartDateChange: (date: Date | undefined) => void;
	endDate: Date | undefined;
	onEndDateChange: (date: Date | undefined) => void;
	onClearFilters: () => void;
}

export function LogFilters({
	typeFilter,
	onTypeFilterChange,
	repoFilter,
	onRepoFilterChange,
	repositories,
	startDate,
	onStartDateChange,
	endDate,
	onEndDateChange,
	onClearFilters,
}: LogFiltersProps) {
	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle className="text-lg">Filters</CardTitle>
				<CardDescription>
					Filter logs by type, repository, or date range
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-wrap gap-4 items-end">
					<div>
						<label className="text-sm font-medium block mb-2">
							Type
						</label>
						<Tabs
							value={typeFilter}
							onValueChange={(v) =>
								onTypeFilterChange(
									v as "all" | "pr" | "issue",
								)
							}
						>
							<TabsList>
								<TabsTrigger value="all">All</TabsTrigger>
								<TabsTrigger value="pr">
									Pull Requests
								</TabsTrigger>
								<TabsTrigger value="issue">Issues</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					<div>
						<label className="text-sm font-medium block mb-2">
							Repository
						</label>
						<Select
							value={repoFilter}
							onValueChange={onRepoFilterChange}
						>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="All Repositories" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									All Repositories
								</SelectItem>
								{repositories.map((repo) => (
									<SelectItem key={repo.id} value={repo.id}>
										{repo.fullName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<label className="text-sm font-medium block mb-2">
							Start Date
						</label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-[150px] justify-start text-left font-normal"
								>
									<CalendarIcon className="w-4 h-4 mr-2" />
									{startDate
										? format(startDate, "MMM d, yyyy")
										: "Pick Date"}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="w-auto p-0"
								align="start"
							>
								<Calendar
									mode="single"
									selected={startDate}
									onSelect={onStartDateChange}
								/>
							</PopoverContent>
						</Popover>
					</div>

					<div>
						<label className="text-sm font-medium block mb-2">
							End Date
						</label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-[150px] justify-start text-left font-normal"
								>
									<CalendarIcon className="w-4 h-4 mr-2" />
									{endDate
										? format(endDate, "MMM d, yyyy")
										: "Pick Date"}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="w-auto p-0"
								align="start"
							>
								<Calendar
									mode="single"
									selected={endDate}
									onSelect={onEndDateChange}
								/>
							</PopoverContent>
						</Popover>
					</div>

					<Button variant="ghost" onClick={onClearFilters}>
						Clear Filters
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
