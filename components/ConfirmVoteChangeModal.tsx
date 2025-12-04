"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmVoteChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentCelebrityName: string;
  newCelebrityName: string;
  isLoading?: boolean;
}

export function ConfirmVoteChangeModal({
  isOpen,
  onClose,
  onConfirm,
  currentCelebrityName,
  newCelebrityName,
  isLoading = false,
}: ConfirmVoteChangeModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-md m-4">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Change Your Vote?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                This action will update your vote
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-muted p-4 rounded-md space-y-2">
            <p className="text-sm">
              <span className="font-medium">Current vote:</span>{" "}
              <span className="text-muted-foreground">{currentCelebrityName}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">New vote:</span>{" "}
              <span className="text-primary font-semibold">{newCelebrityName}</span>
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to change your vote? Your previous vote will be
            removed and replaced with this new vote.
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Changing..." : "Yes, Change Vote"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
