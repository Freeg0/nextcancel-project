import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-6xl font-bold tracking-tight">
          Next<span className="text-primary">Cancel</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Vote for the celebrity you think will become the next trendy star
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/celebrities">Browse Celebrities</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/leaderboard">View Leaderboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
