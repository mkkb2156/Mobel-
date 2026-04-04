import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CONDITION_LABELS } from "@/lib/constants";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0];

  return (
    <Card hover className="group relative">
      <Link href={`/products/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-linen">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.alt || product.title_zh}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-walnut/30">
              <span className="font-serif text-lg">MOBEL</span>
            </div>
          )}

          {/* Wishlist button */}
          <button
            className="absolute right-3 top-3 rounded-full bg-white/80 p-2 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="加入收藏"
            onClick={(e) => {
              e.preventDefault();
              // TODO: wishlist logic
            }}
          >
            <Heart className="h-4 w-4 text-walnut" />
          </button>

          {/* Condition badge */}
          {product.condition && (
            <div className="absolute bottom-3 left-3">
              <Badge>{CONDITION_LABELS[product.condition] || product.condition}</Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {product.designer_id && (
            <p className="text-xs uppercase tracking-wider text-brass">
              {product.style || "設計師作品"}
            </p>
          )}
          <h3 className="mt-1 font-serif text-base font-semibold leading-tight text-charcoal">
            {product.title_zh}
          </h3>
          <p className="mt-0.5 text-xs text-walnut/70">{product.title}</p>
          <p className="mt-2 text-sm font-medium text-charcoal">
            NT$ {product.price_twd.toLocaleString()}
          </p>
        </div>
      </Link>
    </Card>
  );
}
