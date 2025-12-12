"use server";

import { db } from "@/lib/db";

export async function getCelebrities() {
  try {
    const celebrities = await db.celebrity.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        totalVotes: "desc",
      },
    });
    return { celebrities, error: null };
  } catch (error) {
    console.error("Error fetching celebrities:", error);
    return { celebrities: [], error: "Failed to fetch celebrities" };
  }
}

export async function searchCelebrities(query: string) {
  try {
    const celebrities = await db.celebrity.findMany({
      where: {
        isActive: true,
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: {
        totalVotes: "desc",
      },
    });
    return { celebrities, error: null };
  } catch (error) {
    console.error("Error searching celebrities:", error);
    return { celebrities: [], error: "Failed to search celebrities" };
  }
}

export async function getCelebrityById(id: string) {
  try {
    const celebrity = await db.celebrity.findUnique({
      where: { id },
      include: {
        votes: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          take: 10,
          orderBy: {
            votedAt: "desc",
          },
        },
      },
    });
    return { celebrity, error: null };
  } catch (error) {
    console.error("Error fetching celebrity:", error);
    return { celebrity: null, error: "Failed to fetch celebrity" };
  }
}
