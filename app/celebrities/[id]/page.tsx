import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoteButton } from "@/components/VoteButton";
import { formatDate } from "@/lib/utils";

interface CelebrityPageProps {
  params: Promise<{ id: string }>;
}

export default async function CelebrityPage({ params }: CelebrityPageProps) {
  const { id } = await params;
  const session = await auth();

  const celebrity = await db.celebrity.findUnique({
    where: { id },
    include: {
      _count: {
        select: { votes: true },
      },
    },
  });

  if (!celebrity) {
    notFound();
  }

  // Check if user has already voted
  let userVote = null;
  if (session?.user?.id) {
    userVote = await db.vote.findUnique({
      where: { userId: session.user.id },
      include: { celebrity: true },
    });
  }

  const hasVotedForThisCelebrity = userVote?.celebrityId === celebrity.id;
  const hasVotedForOther = userVote && !hasVotedForThisCelebrity;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="aspect-[3/4] relative bg-muted">
              <Image
                src={celebrity.imageUrl}
                alt={celebrity.displayName}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <CardContent className="p-6 md:p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {celebrity.displayName}
                  </h1>
                  <p className="text-muted-foreground">
                    {celebrity.firstName} {celebrity.lastName}
                  </p>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Born:</span>
                    <p className="text-muted-foreground">
                      {formatDate(new Date(celebrity.birthDate))}
                    </p>
                  </div>

                  {celebrity.bio && (
                    <div>
                      <span className="text-sm font-medium">Bio:</span>
                      <p className="text-muted-foreground mt-1">
                        {celebrity.bio}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {celebrity._count.votes}{" "}
                    {celebrity._count.votes === 1 ? "vote" : "votes"}
                  </Badge>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {hasVotedForThisCelebrity ? (
                  <div className="text-sm text-green-600 bg-green-50 p-4 rounded-md border border-green-200">
                    You voted for {celebrity.displayName}
                  </div>
                ) : hasVotedForOther ? (
                  <div className="text-sm text-amber-600 bg-amber-50 p-4 rounded-md border border-amber-200">
                    You already voted for {userVote?.celebrity.displayName}. You
                    can only vote once.
                  </div>
                ) : (
                  <VoteButton
                    celebrityId={celebrity.id}
                    isSignedIn={!!session?.user}
                  />
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
