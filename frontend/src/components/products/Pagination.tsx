"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  // Determine visible page numbers
  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center justify-center gap-1 pt-8" aria-label="分頁">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm text-walnut hover:text-brass transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          上一頁
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-sm text-walnut/30 cursor-not-allowed">
          <ChevronLeft className="h-4 w-4" />
          上一頁
        </span>
      )}

      {/* Page numbers */}
      {pages[0] > 1 && (
        <>
          <Link
            href={buildHref(1)}
            className="flex h-9 w-9 items-center justify-center text-sm text-walnut hover:text-brass transition-colors"
          >
            1
          </Link>
          {pages[0] > 2 && (
            <span className="flex h-9 w-9 items-center justify-center text-sm text-walnut/30">
              ...
            </span>
          )}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={cn(
            "flex h-9 w-9 items-center justify-center text-sm transition-colors",
            page === currentPage
              ? "bg-brass text-cream font-medium"
              : "text-walnut hover:text-brass"
          )}
        >
          {page}
        </Link>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="flex h-9 w-9 items-center justify-center text-sm text-walnut/30">
              ...
            </span>
          )}
          <Link
            href={buildHref(totalPages)}
            className="flex h-9 w-9 items-center justify-center text-sm text-walnut hover:text-brass transition-colors"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 text-sm text-walnut hover:text-brass transition-colors"
        >
          下一頁
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 text-sm text-walnut/30 cursor-not-allowed">
          下一頁
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
