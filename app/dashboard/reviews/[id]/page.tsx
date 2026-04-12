import { Metadata } from "next";
import ReviewDetailClient from "@/modules/review/components/review-detail-client";

export const metadata: Metadata = {
	title: "Review Detail",
	description: "View the full AI-generated code review.",
};

export default async function ReviewDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <ReviewDetailClient reviewId={id} />;
}
