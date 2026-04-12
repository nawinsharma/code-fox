"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
	Plus,
	GitPullRequest,
	Loader2,
	CheckCircle2,
	Clock,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

import { getConnectedRepositories } from "@/modules/settings/actions";
import {
	getOpenPullRequests,
	requestManualReview,
} from "@/modules/review/actions";

export function RequestReviewDialog() {
	const [open, setOpen] = useState(false);
	const [selectedRepoId, setSelectedRepoId] = useState<string>("");
	const queryClient = useQueryClient();

	const { data: repos, isLoading: reposLoading } = useQuery({
		queryKey: ["connected-repositories"],
		queryFn: getConnectedRepositories,
		enabled: open,
	});

	const { data: pullRequests, isLoading: prsLoading } = useQuery({
		queryKey: ["open-prs", selectedRepoId],
		queryFn: () => getOpenPullRequests(selectedRepoId),
		enabled: !!selectedRepoId,
	});

	const reviewMutation = useMutation({
		mutationFn: ({ repoId, prNumber }: { repoId: string; prNumber: number }) =>
			requestManualReview(repoId, prNumber),
		onSuccess: () => {
			toast.success("Review requested! It will appear shortly.");
			queryClient.invalidateQueries({ queryKey: ["reviews"] });
			queryClient.invalidateQueries({
				queryKey: ["open-prs", selectedRepoId],
			});
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to request review");
		},
	});

	const handleRepoChange = (repoId: string) => {
		setSelectedRepoId(repoId);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="h-4 w-4 mr-2" />
					Request Review
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>Request AI Review</DialogTitle>
					<DialogDescription>
						Select a repository and pick a pull request to review.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 flex-1 overflow-hidden flex flex-col">
					<Select
						value={selectedRepoId}
						onValueChange={handleRepoChange}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a repository" />
						</SelectTrigger>
						<SelectContent>
							{reposLoading ? (
								<SelectItem value="loading" disabled>
									Loading...
								</SelectItem>
							) : repos && repos.length > 0 ? (
								repos.map((repo) => (
									<SelectItem
										key={repo.id}
										value={repo.id}
									>
										{repo.fullName}
									</SelectItem>
								))
							) : (
								<SelectItem value="none" disabled>
									No connected repositories
								</SelectItem>
							)}
						</SelectContent>
					</Select>

					{selectedRepoId && (
						<div className="flex-1 overflow-y-auto space-y-2 min-h-0">
							{prsLoading ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
								</div>
							) : pullRequests && pullRequests.length > 0 ? (
								pullRequests.map((pr) => (
									<div
										key={pr.number}
										className="flex items-center justify-between gap-3 rounded-lg border p-3"
									>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<GitPullRequest className="h-4 w-4 text-muted-foreground shrink-0" />
												<span className="text-sm font-medium truncate">
													{pr.title}
												</span>
											</div>
											<div className="flex items-center gap-2 mt-1">
												<span className="text-xs text-muted-foreground">
													#{pr.number} by{" "}
													{pr.author}
												</span>
												<span className="text-xs text-muted-foreground">
													{formatDistanceToNow(
														new Date(
															pr.updatedAt
														),
														{
															addSuffix: true,
														}
													)}
												</span>
											</div>
										</div>
										<div className="shrink-0">
											{pr.reviewStatus ===
											"completed" ? (
												<Badge
													variant="default"
													className="gap-1"
												>
													<CheckCircle2 className="h-3 w-3" />
													Reviewed
												</Badge>
											) : pr.reviewStatus ===
											  "pending" ? (
												<Badge
													variant="secondary"
													className="gap-1"
												>
													<Clock className="h-3 w-3" />
													Pending
												</Badge>
											) : pr.reviewStatus ===
											  "failed" ? (
												<Button
													size="sm"
													variant="outline"
													className="gap-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
													disabled={
														reviewMutation.isPending
													}
													onClick={() =>
														reviewMutation.mutate(
															{
																repoId: selectedRepoId,
																prNumber:
																	pr.number,
															}
														)
													}
												>
													{reviewMutation.isPending ? (
														<Loader2 className="h-3 w-3 animate-spin" />
													) : (
														<>
															<XCircle className="h-3 w-3" />
															Retry
														</>
													)}
												</Button>
											) : (
												<Button
													size="sm"
													variant="outline"
													disabled={
														reviewMutation.isPending
													}
													onClick={() =>
														reviewMutation.mutate(
															{
																repoId: selectedRepoId,
																prNumber:
																	pr.number,
															}
														)
													}
												>
													{reviewMutation.isPending ? (
														<Loader2 className="h-3 w-3 animate-spin" />
													) : (
														"Review"
													)}
												</Button>
											)}
										</div>
									</div>
								))
							) : (
								<div className="text-center py-8 text-sm text-muted-foreground">
									No open pull requests in this repository.
								</div>
							)}
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
