import type { Metadata } from "next";
import RulesPageClient from "@/modules/rules/components/rules-page-client";

export const metadata: Metadata = {
	title: "Custom Rules",
};

export default function RulesPage() {
	return <RulesPageClient />;
}
