import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold">Celebrity Not Found</h1>
        <p className="text-muted-foreground">
          The celebrity you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button asChild>
          <Link href="/">Back to Celebrities</Link>
        </Button>
      </div>
    </div>
  );
}
