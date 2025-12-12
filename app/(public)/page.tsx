"use client";

import { useState, useEffect, useCallback } from "react";
import { SearchBar } from "@/components/search-bar";
import { CelebrityCard } from "@/components/celebrity-card";
import { getCelebrities, searchCelebrities } from "@/lib/actions/celebrity";

interface Celebrity {
  id: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
  totalVotes: number;
}

export default function HomePage() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCelebrities();
  }, []);

  const loadCelebrities = async () => {
    setLoading(true);
    const { celebrities: data, error } = await getCelebrities();
    if (error) {
      setError(error);
    } else {
      setCelebrities(data);
    }
    setLoading(false);
  };

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadCelebrities();
      return;
    }

    setLoading(true);
    const { celebrities: data, error } = await searchCelebrities(query);
    if (error) {
      setError(error);
    } else {
      setCelebrities(data);
      setError(null);
    }
    setLoading(false);
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Vote for the Next Celebrity
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Choose which French influencer should be next to face public scrutiny.
          One vote per season!
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <SearchBar onSearch={handleSearch} />
      </div>

      {error && (
        <div className="max-w-2xl mx-auto rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse"
            />
          ))}
        </div>
      ) : celebrities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500 dark:text-zinc-400">
            No celebrities found. Try a different search or check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {celebrities.map((celebrity) => (
            <CelebrityCard key={celebrity.id} {...celebrity} />
          ))}
        </div>
      )}
    </div>
  );
}
