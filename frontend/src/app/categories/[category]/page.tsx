interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  const categoryLabels: Record<string, string> = {
    seating: "座椅",
    tables: "桌几",
    storage: "收納",
    lighting: "燈具",
    decor: "裝飾",
    outdoor: "戶外",
  };

  const label = categoryLabels[category] || category;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-bold text-charcoal">{label}</h1>
      <p className="mt-3 text-walnut/70">瀏覽 {label} 分類的精選商品</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse bg-linen" />
        ))}
      </div>
    </div>
  );
}
