import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RulesLoading() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<Skeleton className="h-8 w-36 mb-2" />
				<Skeleton className="h-4 w-96" />
			</div>
			<Card className="mb-6">
				<CardHeader>
					<Skeleton className="h-5 w-28 mb-2" />
					<Skeleton className="h-4 w-80" />
				</CardHeader>
				<CardContent className="space-y-4">
					<Skeleton className="h-10 w-full" />
					<div className="flex items-center justify-between">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-8 w-24" />
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<Skeleton className="h-5 w-28 mb-2" />
					<Skeleton className="h-4 w-80" />
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className="flex items-start gap-3 p-4 border rounded-lg"
							>
								<div className="flex-1">
									<Skeleton className="h-4 w-full mb-2" />
									<Skeleton className="h-3 w-24" />
								</div>
								<div className="flex gap-2">
									<Skeleton className="h-8 w-14" />
									<Skeleton className="h-8 w-16" />
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
