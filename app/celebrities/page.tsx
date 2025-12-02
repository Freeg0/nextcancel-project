import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { Pagination } from "@/components/Pagination";
import { formatDate } from "@/lib/utils";

const ITEMS_PER_PAGE = 12;

interface CelebritiesPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function CelebritiesPage({
  searchParams,
}: CelebritiesPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || "";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Celebrities</h1>
          <p className="text-muted-foreground">
            Browse and vote for your favorite celebrity
          </p>
        </div>

        <SearchBar defaultValue={search} />

        {celebrities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {search
                ? `No celebrities found matching "${search}"`
                : "No celebrities available yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {celebrities.map((celebrity) => (
                <Link key={celebrity.id} href={`/celebrities/${celebrity.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="aspect-[3/4] relative bg-muted">
                      <Image
                        src={celebrity.imageUrl}
                        alt={celebrity.displayName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {celebrity.displayName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Born {formatDate(new Date(celebrity.birthDate))}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Badge variant="secondary">
                        {celebrity._count.votes}{" "}
                        {celebrity._count.votes === 1 ? "vote" : "votes"}
                      </Badge>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                searchQuery={search}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
