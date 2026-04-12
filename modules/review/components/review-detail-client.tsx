"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	ExternalLink,
	Clock,
	CheckCircle2,
	XCircle,
	ArrowLeft,
	GitPullRequest,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

import { getReviewById } from "@/modules/review/actions";

const statusConfig = {
	completed: {
		label: "Completed",
		variant: "default" as const,
		icon: CheckCircle2,
		className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
	},
	failed: {
		label: "Failed",
		variant: "destructive" as const,
		icon: XCircle,
		className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
	},
	pending: {
		label: "Pending",
		variant: "secondary" as const,
		icon: Clock,
		className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
	},
};

export default function ReviewDetailClient({
	reviewId,
}: {
	reviewId: string;
}) {
	const { data: review, isLoading } = useQuery({
		queryKey: ["review", reviewId],
		queryFn: () => getReviewById(reviewId),
	});

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="h-8 w-32 rounded bg-muted animate-pulse" />
				<div className="rounded-xl border bg-card p-6 space-y-4">
					<div className="h-7 w-72 rounded bg-muted animate-pulse" />
					<div className="h-4 w-48 rounded bg-muted animate-pulse" />
					<div className="h-px bg-border" />
					<div className="space-y-3 pt-2">
						{Array.from({ length: 8 }).map((_, i) => (
							<div
								key={i}
								className="h-4 rounded bg-muted animate-pulse"
								style={{ width: `${75 + Math.random() * 25}%` }}
							/>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (!review) {
		return (
			<div className="space-y-6">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/dashboard/reviews">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Reviews
					</Link>
				</Button>
				<div className="rounded-xl border bg-card">
					<div className="text-center py-16">
						<GitPullRequest className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
						<p className="text-muted-foreground">
							Review not found or you don&apos;t have access to it.
						</p>
					</div>
				</div>
			</div>
		);
	}

	const status =
		statusConfig[review.status as keyof typeof statusConfig] ??
		statusConfig.pending;
	const StatusIcon = status.icon;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Button variant="ghost" size="sm" asChild className="-ml-2">
					<Link href="/dashboard/reviews">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Reviews
					</Link>
				</Button>

				<Button variant="outline" size="sm" asChild>
					<a
						href={review.prUrl}
						target="_blank"
						rel="noopener noreferrer"
					>
						View on GitHub
						<ExternalLink className="h-3.5 w-3.5 ml-2" />
					</a>
				</Button>
			</div>

			<div className="rounded-xl border bg-card overflow-hidden">
				<div className="p-6 pb-0">
					<div className="flex items-start gap-3 mb-3">
						<h1 className="text-xl font-semibold tracking-tight flex-1">
							{review.prTitle}
						</h1>
						<Badge
							variant="outline"
							className={`gap-1.5 shrink-0 ${status.className}`}
						>
							<StatusIcon className="h-3 w-3" />
							{status.label}
						</Badge>
					</div>
					<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mb-6">
						<span className="font-medium text-foreground/80">
							{review.repository.fullName}
						</span>
						<span className="text-border">|</span>
						<span>PR #{review.prNumber}</span>
						<span className="text-border">|</span>
						<span>
							{formatDistanceToNow(new Date(review.createdAt), {
								addSuffix: true,
							})}
						</span>
					</div>
					<Separator />
				</div>

				<div className="p-6">
					<div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:leading-relaxed prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:bg-muted/50 prose-code:before:content-[''] prose-code:after:content-[''] prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-li:marker:text-muted-foreground">
						<ReactMarkdown remarkPlugins={[remarkGfm]}>
							{review.review}
						</ReactMarkdown>
					</div>
				</div>
			</div>
		</div>
	);
}
