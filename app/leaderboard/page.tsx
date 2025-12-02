import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

export default async function LeaderboardPage() {
  const celebrities = await db.celebrity.findMany({
    include: {
      _count: {
        select: { votes: true },
      },
    },
    orderBy: {
      votes: {
        _count: "desc",
      },
    },
    take: 50, // Top 50
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank <= 3) return "default";
    return "secondary";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">
            See who&apos;s leading the race to become the next trendy star
          </p>
        </div>

        {celebrities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No votes yet. Be the first to vote!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {celebrities.map((celebrity, index) => {
              const rank = index + 1;
              const voteCount = celebrity._count.votes;

              return (
                <Link
                  key={celebrity.id}
                  href={`/celebrities/${celebrity.id}`}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 text-center flex-shrink-0">
                          {getRankIcon(rank) || (
                            <span className="text-2xl font-bold text-muted-foreground">
                              {rank}
                            </span>
                          )}
                        </div>

                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          <Image
                            src={celebrity.imageUrl}
                            alt={celebrity.displayName}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate">
                            {celebrity.displayName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {celebrity.firstName} {celebrity.lastName}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Badge variant={getRankBadgeVariant(rank)}>
                            {voteCount} {voteCount === 1 ? "vote" : "votes"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {celebrities.length > 0 && (
          <div className="text-center text-sm text-muted-foreground pt-4">
            Showing top {celebrities.length} celebrities
          </div>
        )}
      </div>
    </div>
  );
}
