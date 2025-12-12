"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Button } from "@/components/ui/button";
import { submitVote } from "@/lib/actions/vote";

interface VoteButtonInnerProps {
  celebrityId: string;
  hasVoted: boolean;
  isAuthenticated: boolean;
}

function VoteButtonInner({ celebrityId, hasVoted, isAuthenticated }: VoteButtonInnerProps) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleVote = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!executeRecaptcha) {
      setError("reCAPTCHA not loaded");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await executeRecaptcha("vote");
      const result = await submitVote(celebrityId, token);

      if (result.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(result.error || "Failed to submit vote");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Button size="lg" onClick={handleVote} className="w-full">
        Sign in to Vote
      </Button>
    );
  }

  if (hasVoted || success) {
    return (
      <Button size="lg" disabled className="w-full">
        ✓ You've Already Voted This Season
      </Button>
    );
  }

  return (
    <div className="w-full space-y-4">
      <Button
        size="lg"
        onClick={handleVote}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Submitting..." : "Vote for This Celebrity"}
      </Button>
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}

interface VoteButtonProps {
  celebrityId: string;
  hasVoted: boolean;
  isAuthenticated: boolean;
}

export function VoteButton(props: VoteButtonProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    return (
      <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
        reCAPTCHA not configured. Please add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to your environment variables.
      </div>
    );
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <VoteButtonInner {...props} />
    </GoogleReCaptchaProvider>
  );
}
