import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  const [userCount, celebrityCount, voteCount, activeSeason] = await Promise.all([
    db.user.count(),
    db.celebrity.count({ where: { isActive: true } }),
    db.vote.count(),
    db.season.findFirst({ where: { isActive: true } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          Manage your platform from here
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Active Celebrities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{celebrityCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total Votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{voteCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Active Season
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold truncate">
              {activeSeason?.name || "None"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            • Add new celebrities from the Celebrities page
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            • Create or end seasons from the Seasons page
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            • View leaderboard from the main site
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
