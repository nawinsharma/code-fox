"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface GithubCardProps {
	repoName: string | null;
	indexingStatus: string | null;
}

export function GithubCard({ repoName, indexingStatus }: GithubCardProps) {
	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>GitHub Integration</CardTitle>
				<CardDescription>
					Your connected repository and indexing status
				</CardDescription>
			</CardHeader>
			<CardContent>
				{repoName ? (
					<div className="p-3 bg-muted rounded-lg">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">
									Connected Repository
								</p>
								<p className="font-medium">{repoName}</p>
							</div>
							{indexingStatus && (
								<span
									className={`px-2 py-1 rounded text-xs font-medium ${
										indexingStatus === "COMPLETED"
											? "bg-primary/10 text-primary"
											: indexingStatus === "INDEXING"
												? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
												: indexingStatus === "FAILED"
													? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
													: "bg-muted text-muted-foreground"
									}`}
								>
									{indexingStatus === "COMPLETED"
										? "Indexed"
										: indexingStatus === "INDEXING"
											? "Indexing..."
											: indexingStatus === "FAILED"
												? "Failed"
												: "Not Indexed"}
								</span>
							)}
						</div>
					</div>
				) : (
					<p className="text-muted-foreground">
						No repository connected. Go to the Repository page to
						connect one.
					</p>
				)}
			</CardContent>
		</Card>
	);
}
