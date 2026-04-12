import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/db";

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const { content } = await req.json();

		const existing = await prisma.rule.findUnique({ where: { id } });
		if (!existing || existing.userId !== session.user.id) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		const rule = await prisma.rule.update({
			where: { id },
			data: { content },
		});

		return NextResponse.json({ rule });
	} catch (error) {
		console.error("Rules PUT error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;

		const existing = await prisma.rule.findUnique({ where: { id } });
		if (!existing || existing.userId !== session.user.id) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		await prisma.rule.delete({ where: { id } });

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Rules DELETE error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
