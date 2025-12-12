import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SeasonsPage() {
  const seasons = await db.season.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { votes: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Seasons</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            View and manage voting seasons
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Seasons ({seasons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {seasons.length === 0 ? (
            <p className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              No seasons yet. Create one using the database or admin API.
            </p>
          ) : (
            <div className="space-y-4">
              {seasons.map((season) => (
                <div
                  key={season.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{season.name}</h3>
                      <Badge variant={season.isActive ? "default" : "secondary"}>
                        {season.isActive ? "Active" : "Ended"}
                      </Badge>
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      Started: {new Date(season.startDate).toLocaleDateString()}
                      {season.endDate && (
                        <> • Ended: {new Date(season.endDate).toLocaleDateString()}</>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{season._count.votes}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">votes</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
