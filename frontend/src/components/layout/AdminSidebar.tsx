"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ClipboardCheck,
  ShoppingCart,
  Truck,
  Bot,
  Ship,
  FileText,
  BarChart3,
} from "lucide-react";
import { ADMIN_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  "/admin": <LayoutDashboard className="h-4 w-4" />,
  "/admin/products": <Package className="h-4 w-4" />,
  "/admin/review": <ClipboardCheck className="h-4 w-4" />,
  "/admin/orders": <ShoppingCart className="h-4 w-4" />,
  "/admin/purchases": <FileText className="h-4 w-4" />,
  "/admin/scraper": <Bot className="h-4 w-4" />,
  "/admin/shipments": <Ship className="h-4 w-4" />,
  "/admin/customs": <Truck className="h-4 w-4" />,
  "/admin/analytics": <BarChart3 className="h-4 w-4" />,
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-linen bg-white">
      <div className="p-6">
        <Link href="/admin" className="font-serif text-lg font-bold tracking-wider text-charcoal">
          MOBEL Admin
        </Link>
      </div>
      <nav className="space-y-0.5 px-3 pb-6">
        {ADMIN_NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-brass/10 font-medium text-brass"
                  : "text-walnut hover:bg-linen/50 hover:text-charcoal"
              )}
            >
              {iconMap[link.href]}
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
