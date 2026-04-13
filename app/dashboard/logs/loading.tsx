import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LogsLoading() {
	return (
		<div className="max-w-7xl mx-auto">
			<div className="mb-8">
				<Skeleton className="h-8 w-36 mb-2" />
				<Skeleton className="h-4 w-80" />
			</div>
			<Card className="mb-6">
				<CardHeader>
					<Skeleton className="h-5 w-20 mb-2" />
					<Skeleton className="h-4 w-64" />
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						<Skeleton className="h-10 w-48" />
						<Skeleton className="h-10 w-[200px]" />
						<Skeleton className="h-10 w-[150px]" />
						<Skeleton className="h-10 w-[150px]" />
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<Skeleton className="h-5 w-16 mb-2" />
					<Skeleton className="h-4 w-32" />
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="flex gap-4">
								<Skeleton className="h-6 w-16" />
								<Skeleton className="h-6 w-12" />
								<Skeleton className="h-6 flex-1" />
								<Skeleton className="h-6 w-32" />
								<Skeleton className="h-6 w-36" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
