"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
	const [client] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 5 * 60 * 1000, // 5 minutes — navigating between pages won't refetch
						gcTime: 10 * 60 * 1000, // 10 minutes — cache survives longer for back/forward nav
						refetchOnWindowFocus: false,
						retry: 1,
					},
				},
			})
	);

	return (
		<QueryClientProvider client={client}>
			{children}
		</QueryClientProvider>
	);
}
