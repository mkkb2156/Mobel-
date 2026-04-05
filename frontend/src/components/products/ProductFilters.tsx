"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { X, SlidersHorizontal, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CATEGORIES, STYLES, CONDITION_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const DECADES = [
  "1920s", "1930s", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s",
];

const MATERIALS = [
  { slug: "wood", label: "木材" },
  { slug: "metal", label: "金屬" },
  { slug: "glass", label: "玻璃" },
  { slug: "leather", label: "皮革" },
  { slug: "fabric", label: "布料" },
  { slug: "plastic", label: "塑料" },
  { slug: "ceramic", label: "陶瓷" },
];

function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-linen pb-4">
      <button
        type="button"
        className="flex w-full items-center justify-between py-2 text-sm font-medium text-charcoal"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? (
          <ChevronUp className="h-4 w-4 text-walnut/50" />
        ) : (
          <ChevronDown className="h-4 w-4 text-walnut/50" />
        )}
      </button>
      {open && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-walnut hover:text-charcoal transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-linen text-brass accent-brass focus:ring-brass"
      />
      {label}
    </label>
  );
}

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getParam = useCallback(
    (key: string) => searchParams.get(key) || "",
    [searchParams]
  );

  const getParamArray = useCallback(
    (key: string): string[] => {
      const val = searchParams.get(key);
      return val ? val.split(",") : [];
    },
    [searchParams]
  );

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset to page 1 on filter change
      params.delete("page");
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, pathname, router]
  );

  const toggleArrayParam = useCallback(
    (key: string, value: string) => {
      const current = getParamArray(key);
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      updateParams({ [key]: next.length > 0 ? next.join(",") : null });
    },
    [getParamArray, updateParams]
  );

  const clearAll = useCallback(() => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [router, pathname]);

  const hasFilters = searchParams.toString().length > 0;

  const selectedCategories = getParamArray("category");
  const selectedStyles = getParamArray("style");
  const selectedConditions = getParamArray("condition");
  const selectedMaterials = getParamArray("materials");
  const selectedDecade = getParam("decade");
  const minPrice = getParam("min_price");
  const maxPrice = getParam("max_price");
  const designer = getParam("designer");

  const filterContent = (
    <div className={cn("space-y-4", isPending && "opacity-60 pointer-events-none")}>
      {/* Category filter */}
      <FilterSection title="分類">
        {CATEGORIES.map((cat) => (
          <CheckboxItem
            key={cat.slug}
            label={cat.label}
            checked={selectedCategories.includes(cat.slug)}
            onChange={() => toggleArrayParam("category", cat.slug)}
          />
        ))}
      </FilterSection>

      {/* Style filter */}
      <FilterSection title="風格">
        {STYLES.map((style) => (
          <CheckboxItem
            key={style.slug}
            label={style.label}
            checked={selectedStyles.includes(style.slug)}
            onChange={() => toggleArrayParam("style", style.slug)}
          />
        ))}
      </FilterSection>

      {/* Decade filter */}
      <FilterSection title="年代">
        <select
          value={selectedDecade}
          onChange={(e) => updateParams({ decade: e.target.value || null })}
          className="w-full border border-linen bg-white px-3 py-2 text-sm text-charcoal focus:border-brass focus:outline-none"
        >
          <option value="">全部年代</option>
          {DECADES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Price range filter */}
      <FilterSection title="價格範圍 (TWD)">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="最低"
            value={minPrice}
            onChange={(e) => updateParams({ min_price: e.target.value || null })}
            className="text-xs"
          />
          <span className="text-walnut/50">-</span>
          <Input
            type="number"
            placeholder="最高"
            value={maxPrice}
            onChange={(e) => updateParams({ max_price: e.target.value || null })}
            className="text-xs"
          />
        </div>
      </FilterSection>

      {/* Condition filter */}
      <FilterSection title="狀態">
        {Object.entries(CONDITION_LABELS).map(([key, label]) => (
          <CheckboxItem
            key={key}
            label={label}
            checked={selectedConditions.includes(key)}
            onChange={() => toggleArrayParam("condition", key)}
          />
        ))}
      </FilterSection>

      {/* Designer search */}
      <FilterSection title="設計師">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-walnut/40" />
          <input
            type="text"
            placeholder="搜尋設計師..."
            value={designer}
            onChange={(e) => updateParams({ designer: e.target.value || null })}
            className="w-full border border-linen bg-white py-2 pl-9 pr-3 text-sm text-charcoal placeholder:text-walnut/40 focus:border-brass focus:outline-none"
          />
        </div>
      </FilterSection>

      {/* Materials filter */}
      <FilterSection title="材質" defaultOpen={false}>
        {MATERIALS.map((mat) => (
          <CheckboxItem
            key={mat.slug}
            label={mat.label}
            checked={selectedMaterials.includes(mat.slug)}
            onChange={() => toggleArrayParam("materials", mat.slug)}
          />
        ))}
      </FilterSection>

      {/* Clear all */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-walnut/70"
          onClick={clearAll}
        >
          <X className="h-3.5 w-3.5" />
          清除所有篩選
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          篩選
          {hasFilters && (
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center bg-brass text-cream text-xs rounded-full">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-charcoal/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-cream overflow-y-auto">
            <div className="flex items-center justify-between border-b border-linen px-5 py-4">
              <h2 className="font-serif text-lg font-semibold text-charcoal">
                篩選
              </h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-walnut hover:text-charcoal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-5 py-4">{filterContent}</div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <h2 className="mb-4 font-serif text-lg font-semibold text-charcoal">
          篩選
        </h2>
        {filterContent}
      </aside>
    </>
  );
}
