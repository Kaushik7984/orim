import { NextResponse } from "next/server";

// Simulated database
let invitations: any[] = [];

export async function POST(req: Request) {
  try {
    const { email, boardId, message } = await req.json();

    if (!email || !boardId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Simulate creating an invitation
    const invitation = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      boardId,
      message,
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    invitations.push(invitation);

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("[TEST_INVITATIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json(invitations);
  } catch (error) {
    console.error("[TEST_INVITATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 