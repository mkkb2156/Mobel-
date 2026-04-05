import { Suspense } from "react";
import type { Metadata } from "next";
import { MOCK_PRODUCTS, getDesignerById } from "@/lib/mock-products";
import { CATEGORIES, STYLES } from "@/lib/constants";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSort } from "@/components/products/ProductSort";
import { SearchBar } from "@/components/products/SearchBar";
import { Pagination } from "@/components/products/Pagination";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "所有商品 | MOBEL",
  description: "探索我們精選的歐洲古董家具。從北歐經典到裝飾藝術，為您的空間找到獨一無二的設計。",
};

const PER_PAGE = 8;

function filterAndSortProducts(
  params: Record<string, string | string[] | undefined>
): { products: Product[]; total: number; page: number; totalPages: number } {
  let filtered = [...MOCK_PRODUCTS];

  // Search
  const search = typeof params.search === "string" ? params.search.toLowerCase() : "";
  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.title_zh.includes(search) ||
        (p.description_zh && p.description_zh.includes(search)) ||
        (p.description && p.description.toLowerCase().includes(search))
    );
  }

  // Category filter
  const categories = typeof params.category === "string" && params.category
    ? params.category.split(",")
    : [];
  if (categories.length > 0) {
    filtered = filtered.filter((p) => categories.includes(p.category));
  }

  // Style filter
  const styles = typeof params.style === "string" && params.style
    ? params.style.split(",")
    : [];
  if (styles.length > 0) {
    filtered = filtered.filter((p) => p.style && styles.includes(p.style));
  }

  // Decade filter
  const decade = typeof params.decade === "string" ? params.decade : "";
  if (decade) {
    filtered = filtered.filter((p) => p.period === decade);
  }

  // Price range filter
  const minPrice = typeof params.min_price === "string" ? Number(params.min_price) : NaN;
  const maxPrice = typeof params.max_price === "string" ? Number(params.max_price) : NaN;
  if (!isNaN(minPrice)) {
    filtered = filtered.filter((p) => p.price_twd >= minPrice);
  }
  if (!isNaN(maxPrice)) {
    filtered = filtered.filter((p) => p.price_twd <= maxPrice);
  }

  // Condition filter
  const conditions = typeof params.condition === "string" && params.condition
    ? params.condition.split(",")
    : [];
  if (conditions.length > 0) {
    filtered = filtered.filter((p) => conditions.includes(p.condition));
  }

  // Materials filter
  const materials = typeof params.materials === "string" && params.materials
    ? params.materials.split(",")
    : [];
  if (materials.length > 0) {
    filtered = filtered.filter((p) =>
      p.materials.some((m) => materials.includes(m.toLowerCase()))
    );
  }

  // Designer search
  const designer = typeof params.designer === "string" ? params.designer.toLowerCase() : "";
  if (designer) {
    filtered = filtered.filter((p) => {
      if (!p.designer_id) return false;
      const d = getDesignerById(p.designer_id);
      return (
        d &&
        (d.name.toLowerCase().includes(designer) ||
          (d.name_zh && d.name_zh.includes(designer)))
      );
    });
  }

  // Sorting
  const sort = typeof params.sort === "string" ? params.sort : "newest";
  switch (sort) {
    case "price_asc":
      filtered.sort((a, b) => a.price_twd - b.price_twd);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.price_twd - a.price_twd);
      break;
    case "designer_az":
      filtered.sort((a, b) => {
        const nameA = a.designer_id ? getDesignerById(a.designer_id)?.name || "ZZZ" : "ZZZ";
        const nameB = b.designer_id ? getDesignerById(b.designer_id)?.name || "ZZZ" : "ZZZ";
        return nameA.localeCompare(nameB);
      });
      break;
    case "newest":
    default:
      filtered.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
  }

  // Pagination
  const total = filtered.length;
  const page = Math.max(1, typeof params.page === "string" ? Number(params.page) : 1);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const paged = filtered.slice(start, start + PER_PAGE);

  return { products: paged, total, page, totalPages };
}

function ActiveFilters({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const tags: string[] = [];

  const categories = typeof searchParams.category === "string" && searchParams.category
    ? searchParams.category.split(",")
    : [];
  for (const c of categories) {
    const cat = CATEGORIES.find((x) => x.slug === c);
    if (cat) tags.push(cat.label);
  }

  const styles = typeof searchParams.style === "string" && searchParams.style
    ? searchParams.style.split(",")
    : [];
  for (const s of styles) {
    const style = STYLES.find((x) => x.slug === s);
    if (style) tags.push(style.label);
  }

  if (typeof searchParams.decade === "string" && searchParams.decade) {
    tags.push(searchParams.decade);
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center bg-linen px-2.5 py-1 text-xs text-walnut"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { products, total, page, totalPages } = filterAndSortProducts(params);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-charcoal">所有商品</h1>
        <p className="mt-3 text-walnut/70">探索我們精選的歐洲古董家具</p>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <Suspense fallback={<div className="h-12 bg-linen animate-pulse" />}>
          <SearchBar />
        </Suspense>
      </div>

      <div className="flex gap-10">
        {/* Filters sidebar */}
        <Suspense fallback={null}>
          <ProductFilters />
        </Suspense>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort and count bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-linen pb-4">
            <p className="text-sm text-walnut/70">
              顯示 <span className="font-medium text-charcoal">{total}</span> 件商品
            </p>
            <Suspense fallback={null}>
              <ProductSort />
            </Suspense>
          </div>

          {/* Active filter tags */}
          <ActiveFilters searchParams={params} />

          {/* Product grid */}
          <div className="mt-6">
            <ProductGrid products={products} columns={3} />
          </div>

          {/* Pagination */}
          <Suspense fallback={null}>
            <Pagination currentPage={page} totalPages={totalPages} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
