import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  searchQuery,
}: PaginationProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    return `/?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        asChild
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
      >
        {currentPage === 1 ? (
          <span className="cursor-not-allowed opacity-50">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </span>
        ) : (
          <Link href={buildUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Link>
        )}
      </Button>

      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <Button
        asChild
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
      >
        {currentPage === totalPages ? (
          <span className="cursor-not-allowed opacity-50">
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </span>
        ) : (
          <Link href={buildUrl(currentPage + 1)}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        )}
      </Button>
    </div>
  );
}
