"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", isPending && "opacity-60")}>
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-walnut/40" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜尋商品、設計師、風格..."
        className="w-full border border-linen bg-white py-3 pl-11 pr-4 text-sm text-charcoal placeholder:text-walnut/40 focus:border-brass focus:outline-none"
      />
    </form>
  );
}
