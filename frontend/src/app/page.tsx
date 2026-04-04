import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center bg-charcoal text-cream">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="font-serif text-5xl font-bold leading-tight tracking-wide md:text-7xl">
            歐洲古董家具
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-linen/80 md:text-xl">
            精選來自歐洲各地的經典設計師作品，為您的空間增添獨特韻味。每一件家具都承載著歷史與工藝之美。
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/products">
              <Button size="lg" variant="primary">
                探索所有商品
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline">
                了解購買流程
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center font-serif text-3xl font-bold text-charcoal">
          精選分類
        </h2>
        <p className="mt-3 text-center text-walnut/70">
          從經典座椅到精緻燈具，探索我們的精選系列
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            { slug: "seating", label: "座椅" },
            { slug: "tables", label: "桌几" },
            { slug: "storage", label: "收納" },
            { slug: "lighting", label: "燈具" },
            { slug: "decor", label: "裝飾" },
            { slug: "outdoor", label: "戶外" },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group flex aspect-square flex-col items-center justify-center border border-linen bg-white transition-colors hover:border-brass"
            >
              <span className="font-serif text-xl font-semibold text-charcoal group-hover:text-brass">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* About teaser */}
      <section className="border-t border-linen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-charcoal">
              為何選擇 MOBEL
            </h2>
            <p className="mt-6 leading-relaxed text-walnut/80">
              我們直接與歐洲古董商合作，確保每件家具的來源與品質。從挑選、運送到清關，我們提供完整的一站式服務，讓您安心享受來自歐洲的經典之美。
            </p>
            <Link href="/about" className="mt-8 inline-block text-sm font-medium text-brass hover:text-brass-dark">
              了解更多 &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
