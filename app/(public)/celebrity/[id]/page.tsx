import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCelebrityById } from "@/lib/actions/celebrity";
import { hasUserVoted } from "@/lib/actions/vote";
import { getCurrentUser } from "@/lib/get-session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoteButton } from "@/components/vote-button";
import { ArrowLeft } from "lucide-react";

export default async function CelebrityPage({
  params,
}: {
  params: { id: string };
}) {
  const { celebrity } = await getCelebrityById(params.id);

  if (!celebrity) {
    notFound();
  }

  const user = await getCurrentUser();
  let userHasVoted = false;
  let votedCelebrity = null;

  if (user) {
    const voteStatus = await hasUserVoted(user.id);
    userHasVoted = voteStatus.hasVoted;
    votedCelebrity = voteStatus.votedCelebrity;
  }

  const socialLinks = celebrity.socialLinks as Record<string, string> | null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <Card>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col items-center gap-4">
              <div className="relative h-48 w-48 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {celebrity.imageUrl ? (
                  <Image
                    src={celebrity.imageUrl}
                    alt={celebrity.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-zinc-400">
                    {celebrity.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="text-center">
                <h1 className="text-3xl font-bold">{celebrity.name}</h1>
                <Badge variant="secondary" className="mt-2">
                  {celebrity.category}
                </Badge>
              </div>

              <div className="text-center w-full">
                <p className="text-4xl font-bold">{celebrity.totalVotes}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Total Votes
                </p>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              {celebrity.description && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {celebrity.description}
                  </p>
                </div>
              )}

              {socialLinks && Object.keys(socialLinks).length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Social Media</h2>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(socialLinks).map(([platform, handle]) => (
                      <Badge key={platform} variant="outline">
                        {platform}: {handle}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4">
                {userHasVoted && votedCelebrity?.id !== celebrity.id && (
                  <div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                    You've already voted for <strong>{votedCelebrity?.name}</strong> this season.
                  </div>
                )}
                <VoteButton
                  celebrityId={celebrity.id}
                  hasVoted={userHasVoted}
                  isAuthenticated={!!user}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {celebrity.votes && celebrity.votes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {celebrity.votes.map((vote) => (
                <div
                  key={vote.id}
                  className="flex justify-between items-center p-2 rounded border border-zinc-200 dark:border-zinc-800"
                >
                  <span className="text-sm font-medium">
                    {vote.user.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(vote.votedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
