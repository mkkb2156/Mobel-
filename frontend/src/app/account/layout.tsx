"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCOUNT_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-charcoal">我的帳戶</h1>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Sidebar nav */}
        <nav className="shrink-0 lg:w-48">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            {ACCOUNT_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block whitespace-nowrap px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-brass/10 font-medium text-brass"
                        : "text-walnut hover:text-charcoal"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
