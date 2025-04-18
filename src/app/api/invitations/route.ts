import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { email, boardId, message } = await req.json();

    if (!email || !boardId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Make request to your backend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/invitations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
        body: JSON.stringify({
          email,
          boardId,
          message,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create invitation");
    }

    const invitation = await response.json();
    return NextResponse.json(invitation);
  } catch (error) {
    console.error("[INVITATIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Make request to your backend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/invitations`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch invitations");
    }

    const invitations = await response.json();
    return NextResponse.json(invitations);
  } catch (error) {
    console.error("[INVITATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
