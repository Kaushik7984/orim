import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return new NextResponse("Invitation ID required", { status: 400 });
    }

    // Make request to your backend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/invitations/${id}/accept`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to accept invitation");
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("[INVITATION_ACCEPT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
