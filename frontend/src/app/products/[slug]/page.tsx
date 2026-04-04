interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image gallery placeholder */}
        <div className="aspect-square bg-linen" />

        {/* Product info */}
        <div>
          <p className="text-xs uppercase tracking-wider text-brass">設計師作品</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-charcoal">
            商品詳情 - {slug}
          </h1>
          <p className="mt-4 text-2xl font-medium text-charcoal">NT$ ---</p>
          <p className="mt-6 leading-relaxed text-walnut/80">
            商品描述將在此顯示。包含尺寸、材質、年代等詳細資訊。
          </p>
        </div>
      </div>
    </div>
  );
}
