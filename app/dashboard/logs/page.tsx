import type { Metadata } from "next";
import LogsPageClient from "@/modules/logs/components/logs-page-client";

export const metadata: Metadata = {
	title: "Activity Logs",
};

export default function LogsPage() {
	return <LogsPageClient />;
}
