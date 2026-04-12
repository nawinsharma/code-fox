import { NextResponse } from "next/server";

export async function GET() {
	try {
		// Basic health check - can be extended to check external services
		return NextResponse.json({
			status: "online",
			uptime: 99.9,
		});
	} catch {
		return NextResponse.json({
			status: "offline",
			uptime: null,
		});
	}
}
