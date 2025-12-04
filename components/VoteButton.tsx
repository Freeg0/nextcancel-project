"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInModal } from "@/components/SignInModal";
import { ConfirmVoteChangeModal } from "@/components/ConfirmVoteChangeModal";
import { ThumbsUp } from "lucide-react";

interface VoteButtonProps {
  celebrityId: string;
  celebrityName: string;
  isSignedIn?: boolean;
  hasVotedForOther?: boolean;
  currentVotedCelebrityName?: string;
}

export function VoteButton({
  celebrityId,
  celebrityName,
  isSignedIn = true,
  hasVotedForOther = false,
  currentVotedCelebrityName = "",
}: VoteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleVote = async () => {
    if (!isSignedIn) {
      setShowSignInModal(true);
      return;
    }

    if (hasVotedForOther) {
      setShowConfirmModal(true);
      return;
    }

    await performVote();
  };

  const performVote = async () => {
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
          setShowConfirmModal(false);
          return;
        }

        // Refresh the page to show updated vote status
        setShowConfirmModal(false);
        router.refresh();
      } catch (error) {
        setError("An error occurred. Please try again.");
        setShowConfirmModal(false);
      }
    });
  };

  return (
    <>
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
          {isPending
            ? hasVotedForOther
              ? "Changing vote..."
              : "Voting..."
            : hasVotedForOther
            ? "Change Vote to this Celebrity"
            : "Vote for this Celebrity"}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          {hasVotedForOther
            ? "Click to change your vote to this celebrity"
            : "You can only vote once. Choose wisely!"}
        </p>
      </div>
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
      <ConfirmVoteChangeModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={performVote}
        currentCelebrityName={currentVotedCelebrityName}
        newCelebrityName={celebrityName}
        isLoading={isPending}
      />
    </>
  );
}
