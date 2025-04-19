import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];

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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          boardId,
          message,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return new NextResponse(
        errorData.message || "Failed to create invitation",
        {
          status: response.status,
        }
      );
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
    // Get the token from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/invitations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
