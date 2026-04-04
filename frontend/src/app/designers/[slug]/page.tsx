interface DesignerDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DesignerDetailPage({ params }: DesignerDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-bold text-charcoal">設計師 - {slug}</h1>
      <p className="mt-4 leading-relaxed text-walnut/80">
        設計師簡介將在此顯示。包含生平、代表作品、設計理念等資訊。
      </p>

      <h2 className="mt-12 font-serif text-2xl font-semibold text-charcoal">相關作品</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse bg-linen" />
        ))}
      </div>
    </div>
  );
}
