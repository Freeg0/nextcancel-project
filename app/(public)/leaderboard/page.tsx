import { getCelebrities } from "@/lib/actions/celebrity";
import { getActiveSeason } from "@/lib/actions/season";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default async function LeaderboardPage() {
  const [{ celebrities }, { season }] = await Promise.all([
    getCelebrities(),
    getActiveSeason(),
  ]);

  const totalVotes = celebrities.reduce((sum, c) => sum + c.totalVotes, 0);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          {season?.name || "Current Season"} Rankings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Voted Celebrities</CardTitle>
        </CardHeader>
        <CardContent>
          {celebrities.length === 0 ? (
            <p className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              No votes yet. Be the first to vote!
            </p>
          ) : (
            <div className="space-y-4">
              {celebrities.map((celebrity, index) => {
                const percentage = totalVotes > 0
                  ? ((celebrity.totalVotes / totalVotes) * 100).toFixed(1)
                  : "0.0";

                const getRankBadge = (rank: number) => {
                  if (rank === 1) return <Badge variant="gold">1st</Badge>;
                  if (rank === 2) return <Badge variant="silver">2nd</Badge>;
                  if (rank === 3) return <Badge variant="bronze">3rd</Badge>;
                  return <Badge variant="outline">{rank}th</Badge>;
                };

                return (
                  <div
                    key={celebrity.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {getRankBadge(index + 1)}
                    </div>

                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                      {celebrity.imageUrl ? (
                        <Image
                          src={celebrity.imageUrl}
                          alt={celebrity.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-zinc-400">
                          {celebrity.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{celebrity.name}</h3>
                      {celebrity.description && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                          {celebrity.description}
                        </p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold">{celebrity.totalVotes}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {percentage}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
