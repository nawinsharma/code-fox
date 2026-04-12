import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SettingsLoading() {
	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<div>
				<Skeleton className="h-9 w-24 mb-2" />
				<Skeleton className="h-4 w-64" />
			</div>
			{Array.from({ length: 4 }).map((_, i) => (
				<Card key={i}>
					<CardHeader>
						<Skeleton className="h-5 w-28 mb-2" />
						<Skeleton className="h-4 w-52" />
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Skeleton className="h-3 w-16 mb-1" />
							<Skeleton className="h-5 w-48" />
						</div>
						<div>
							<Skeleton className="h-3 w-16 mb-1" />
							<Skeleton className="h-5 w-48" />
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
