"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/get-session";
import { revalidatePath } from "next/cache";

export async function submitVote(celebrityId: string, recaptchaToken: string) {
  try {
    const user = await requireAuth();

    // Verify reCAPTCHA
    const recaptchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return { success: false, error: "reCAPTCHA verification failed" };
    }

    const activeSeason = await db.season.findFirst({
      where: { isActive: true },
    });

    if (!activeSeason) {
      return { success: false, error: "No active season" };
    }

    const existingVote = await db.vote.findUnique({
      where: {
        userId_seasonId: {
          userId: user.id,
          seasonId: activeSeason.id,
        },
      },
    });

    if (existingVote) {
      return { success: false, error: "You have already voted this season" };
    }

    await db.$transaction([
      db.vote.create({
        data: {
          userId: user.id,
          celebrityId,
          seasonId: activeSeason.id,
        },
      }),
      db.celebrity.update({
        where: { id: celebrityId },
        data: {
          totalVotes: {
            increment: 1,
          },
        },
      }),
    ]);

    revalidatePath("/");
    revalidatePath("/leaderboard");
    revalidatePath(`/celebrity/${celebrityId}`);

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error submitting vote:", error);
    return { success: false, error: error.message || "Failed to submit vote" };
  }
}

export async function hasUserVoted(userId: string) {
  try {
    const activeSeason = await db.season.findFirst({
      where: { isActive: true },
    });

    if (!activeSeason) {
      return { hasVoted: false, error: null };
    }

    const vote = await db.vote.findUnique({
      where: {
        userId_seasonId: {
          userId,
          seasonId: activeSeason.id,
        },
      },
      include: {
        celebrity: true,
      },
    });

    return { hasVoted: !!vote, votedCelebrity: vote?.celebrity || null, error: null };
  } catch (error) {
    console.error("Error checking vote:", error);
    return { hasVoted: false, votedCelebrity: null, error: "Failed to check vote status" };
  }
}
