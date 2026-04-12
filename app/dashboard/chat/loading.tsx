import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
	return (
		<div className="flex flex-col h-[calc(100vh-4rem)]">
			<div className="flex-1 overflow-y-auto p-4">
				<div className="max-w-3xl mx-auto flex flex-col items-center justify-center h-full">
					<Skeleton className="h-7 w-48 mb-2" />
					<Skeleton className="h-4 w-64 mb-6" />
					<div className="grid grid-cols-2 gap-3 max-w-xl w-full">
						{Array.from({ length: 4 }).map((_, i) => (
							<Card key={i} className="p-4">
								<Skeleton className="h-4 w-full" />
							</Card>
						))}
					</div>
				</div>
			</div>
			<div className="border-t p-4">
				<div className="max-w-3xl mx-auto">
					<Skeleton className="h-12 w-full rounded-full" />
				</div>
			</div>
		</div>
	);
}
