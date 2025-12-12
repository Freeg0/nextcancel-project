import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface CelebrityCardProps {
  id: string;
  name: string;
  imageUrl: string | null;
  totalVotes: number;
  description?: string | null;
}

export function CelebrityCard({
  id,
  name,
  imageUrl,
  totalVotes,
  description,
}: CelebrityCardProps) {
  return (
    <Link href={`/celebrity/${id}`}>
      <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105">
        <CardContent className="p-4">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-zinc-400">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{name}</h3>
              {description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {totalVotes}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">votes</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
