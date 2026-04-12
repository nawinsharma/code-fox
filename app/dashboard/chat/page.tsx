import type { Metadata } from "next";
import ChatPageClient from "@/modules/chat/components/chat-page-client";

export const metadata: Metadata = {
	title: "Chat",
};

export default function ChatPage() {
	return <ChatPageClient />;
}
