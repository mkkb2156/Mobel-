import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "設計師",
};

export default function DesignersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-bold text-charcoal">設計師</h1>
      <p className="mt-3 text-walnut/70">探索歐洲經典家具設計大師</p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-linen bg-white p-6">
            <div className="aspect-square bg-linen" />
            <h3 className="mt-4 font-serif text-xl font-semibold text-charcoal">設計師名稱</h3>
            <p className="mt-1 text-sm text-walnut/60">國籍 / 年代</p>
          </div>
        ))}
      </div>
    </div>
  );
}
