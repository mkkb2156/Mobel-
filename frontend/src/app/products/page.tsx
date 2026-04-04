import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "所有商品",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-bold text-charcoal">所有商品</h1>
      <p className="mt-3 text-walnut/70">探索我們精選的歐洲古董家具</p>

      {/* Filters placeholder */}
      <div className="mt-8 flex flex-wrap gap-3 border-b border-linen pb-6">
        <span className="text-sm text-walnut/50">篩選：分類 / 風格 / 年代 / 價格</span>
      </div>

      {/* Product grid placeholder */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse bg-linen" />
        ))}
      </div>
    </div>
  );
}
