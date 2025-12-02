"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";

interface VoteButtonProps {
  celebrityId: string;
}

export function VoteButton({ celebrityId }: VoteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleVote = async () => {
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ celebrityId }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to vote");
          return;
        }

        // Refresh the page to show updated vote status
        router.refresh();
      } catch (error) {
        setError("An error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}
      <Button
        onClick={handleVote}
        disabled={isPending}
        size="lg"
        className="w-full"
      >
        <ThumbsUp className="h-5 w-5 mr-2" />
        {isPending ? "Voting..." : "Vote for this Celebrity"}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        You can only vote once. Choose wisely!
      </p>
    </div>
  );
}
