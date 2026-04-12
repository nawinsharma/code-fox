/**
 * Reviews page client component displaying AI-generated code reviews
 * 
 * Features:
 * - List of all code reviews with status indicators
 * - Review content display with markdown formatting
 * - Links to original pull requests
 * - Status badges (pending, completed, failed)
 * - Responsive card layout
 * 
 * @component
 */
"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

import { getReviews } from "@/modules/review/actions";
import { RequestReviewDialog } from "@/modules/review/components/request-review-dialog";

export default function ReviewsPageClient() {
	const { data: reviews, isLoading } = useQuery({
		queryKey: ["reviews"],
		queryFn: getReviews,
	});

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Review History
					</h1>
					<p className="text-muted-foreground">
						View all AI code reviews
					</p>
				</div>
				<div>
					<div className="animate-pulse space-y-4">
						<div className="h-10 bg-muted rounded" />
						<div className="h-10 bg-muted rounded" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Review History
					</h1>
					<p className="text-muted-foreground">
						View all AI code reviews
					</p>
				</div>
				<RequestReviewDialog />
			</div>

			{reviews?.length === 0 ? (
				<Card>
					<CardContent className="pt-6">
						<div className="text-center py-12">
							<p className="text-muted-foreground">
								No reviews yet. Connect a repository and open a
								PR to get started.
							</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4">
					{reviews?.map((review: any) => (
						<Link
							key={review.id}
							href={`/dashboard/reviews/${review.id}`}
						>
							<Card className="hover:shadow-md transition-shadow cursor-pointer">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div className="space-y-2 flex-1">
											<div className="flex items-center gap-2">
												<CardTitle className="text-lg">
													{review.prTitle}
												</CardTitle>
												{review.status ===
													"completed" && (
													<Badge
														variant="default"
														className="gap-1"
													>
														<CheckCircle2 className="h-3 w-3" />
														Completed
													</Badge>
												)}
												{review.status === "failed" && (
													<Badge
														variant="destructive"
														className="gap-1"
													>
														<XCircle className="h-3 w-3" />
														Failed
													</Badge>
												)}
												{review.status === "pending" && (
													<Badge
														variant="secondary"
														className="gap-1"
													>
														<Clock className="h-3 w-3" />
														Pending
													</Badge>
												)}
											</div>
											<CardDescription>
												{review.repository.fullName}{" "}
												PR #{review.prNumber}
											</CardDescription>
										</div>

										<Button
											variant="ghost"
											size="icon"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												window.open(
													review.prUrl,
													"_blank",
													"noopener,noreferrer"
												);
											}}
										>
											<ExternalLink className="h-4 w-4" />
										</Button>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											{formatDistanceToNow(
												new Date(review.createdAt),
												{ addSuffix: true }
											)}
										</span>
										<span className="text-sm text-muted-foreground">
											Click to view full review
										</span>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
