import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const voteSchema = z.object({
  celebrityId: z.string().cuid(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be signed in to vote" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = voteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid celebrity ID" },
        { status: 400 }
      );
    }

    const { celebrityId } = parsed.data;

    // Check if celebrity exists
    const celebrity = await db.celebrity.findUnique({
      where: { id: celebrityId },
    });

    if (!celebrity) {
      return NextResponse.json(
        { error: "Celebrity not found" },
        { status: 404 }
      );
    }

    // Check if user has already voted
    const existingVote = await db.vote.findUnique({
      where: { userId: session.user.id },
    });

    let vote;

    if (existingVote) {
      // Check if user is trying to vote for the same celebrity
      if (existingVote.celebrityId === celebrityId) {
        return NextResponse.json(
          { error: "You have already voted for this celebrity" },
          { status: 400 }
        );
      }

      // Update existing vote to new celebrity
      vote = await db.vote.update({
        where: { userId: session.user.id },
        data: {
          celebrityId,
        },
      });
    } else {
      // Create new vote
      vote = await db.vote.create({
        data: {
          userId: session.user.id,
          celebrityId,
        },
      });
    }

    return NextResponse.json(
      {
        message: "Vote recorded successfully",
        vote: {
          id: vote.id,
          celebrityId: vote.celebrityId,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Vote error:", error);

    // Handle Prisma unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "You have already voted" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get user's vote
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ vote: null });
    }

    const vote = await db.vote.findUnique({
      where: { userId: session.user.id },
      include: {
        celebrity: {
          select: {
            id: true,
            displayName: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ vote });
  } catch (error) {
    console.error("Error fetching vote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
