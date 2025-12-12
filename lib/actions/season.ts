"use server";

import { db } from "@/lib/db";

export async function getActiveSeason() {
  try {
    const season = await db.season.findFirst({
      where: {
        isActive: true,
      },
    });
    return { season, error: null };
  } catch (error) {
    console.error("Error fetching active season:", error);
    return { season: null, error: "Failed to fetch active season" };
  }
}
