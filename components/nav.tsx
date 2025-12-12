"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Nav() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            NextCancel
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/leaderboard"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Leaderboard
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              {session.user.isAdmin && (
                <Link href="/admin/dashboard">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {session.user.email}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
