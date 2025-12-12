import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default async function CelebritiesPage() {
  const celebrities = await db.celebrity.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Celebrities</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            View and manage all celebrities
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Celebrities ({celebrities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {celebrities.length === 0 ? (
            <p className="text-center py-8 text-zinc-500 dark:text-zinc-400">
              No celebrities yet. Add some using the registration page or database seed.
            </p>
          ) : (
            <div className="space-y-4">
              {celebrities.map((celebrity) => (
                <div
                  key={celebrity.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800"
                >
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
                    <h3 className="font-semibold">{celebrity.name}</h3>
                    {celebrity.description && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                        {celebrity.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-bold">{celebrity.totalVotes}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">votes</p>
                    </div>
                    <Badge variant={celebrity.isActive ? "default" : "secondary"}>
                      {celebrity.isActive ? "Active" : "Inactive"}
                    </Badge>
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
