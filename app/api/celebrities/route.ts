import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const ITEMS_PER_PAGE = 12;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { displayName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [celebrities, total] = await Promise.all([
      db.celebrity.findMany({
        where,
        include: {
          _count: {
            select: { votes: true },
          },
        },
        orderBy: {
          displayName: "asc",
        },
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      }),
      db.celebrity.count({ where }),
    ]);

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    return NextResponse.json({
      celebrities: celebrities.map((c) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        displayName: c.displayName,
        birthDate: c.birthDate,
        imageUrl: c.imageUrl,
        bio: c.bio,
        voteCount: c._count.votes,
      })),
      pagination: {
        page,
        totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching celebrities:", error);
    return NextResponse.json(
      { error: "Failed to fetch celebrities" },
      { status: 500 }
    );
  }
}
