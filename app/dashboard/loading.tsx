import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
	return (
		<div className="space-y-6">
			<div>
				<Skeleton className="h-9 w-40 mb-2" />
				<Skeleton className="h-4 w-64" />
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="rounded-xl border bg-card p-5">
						<div className="flex items-start justify-between mb-4">
							<Skeleton className="w-10 h-10 rounded-lg" />
							<Skeleton className="h-4 w-8" />
						</div>
						<Skeleton className="h-4 w-24 mb-2" />
						<Skeleton className="h-7 w-16 mb-4" />
						<Skeleton className="h-1.5 w-full rounded-full" />
					</div>
				))}
			</div>

			<Card>
				<CardHeader>
					<Skeleton className="h-5 w-44 mb-2" />
					<Skeleton className="h-4 w-72" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-40 w-full" />
				</CardContent>
			</Card>

			<div className="rounded-xl border bg-card">
				<div className="flex justify-between items-center p-6 pb-2">
					<div className="flex items-center gap-3">
						<Skeleton className="w-9 h-9 rounded-lg" />
						<div>
							<Skeleton className="h-4 w-32 mb-1.5" />
							<Skeleton className="h-3 w-48" />
						</div>
					</div>
					<Skeleton className="h-8 w-36 rounded-md" />
				</div>
				<div className="px-6 pb-4 pt-2">
					<Skeleton className="h-72 w-full rounded-lg" />
				</div>
			</div>
		</div>
	);
}
