import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Heart, MessageSquare, ShoppingBag, Truck, Shield } from "lucide-react";
import {
  getProductBySlug,
  getDesignerById,
  getDealerById,
  MOCK_PRODUCTS,
} from "@/lib/mock-products";
import { CATEGORIES, CONDITION_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/products/Breadcrumbs";
import { ImageGallery } from "@/components/products/ImageGallery";
import { ProductTabs } from "@/components/products/ProductTabs";
import { ProductGrid } from "@/components/products/ProductGrid";

function getRelatedProducts(productId: string, category: string, style: string | null, count = 4) {
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.id !== productId &&
      (p.category === category || p.style === style)
  ).slice(0, count);
}

function conditionVariant(condition: string): "success" | "default" | "warning" {
  switch (condition) {
    case "excellent":
      return "success";
    case "good":
      return "default";
    case "fair":
      return "warning";
    case "restored":
      return "success";
    default:
      return "default";
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "商品未找到 | MOBEL" };
  }
  return {
    title: `${product.title_zh} | MOBEL`,
    description: product.description_zh || product.description || undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const designer = product.designer_id
    ? getDesignerById(product.designer_id)
    : null;
  const dealer = product.dealer_id ? getDealerById(product.dealer_id) : null;
  const categoryInfo = CATEGORIES.find((c) => c.slug === product.category);
  const relatedProducts = getRelatedProducts(
    product.id,
    product.category,
    product.style
  );

  const shippingEstimate = product.price_twd > 100000 ? "4-6 週" : "3-5 週";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          ...(categoryInfo
            ? [
                {
                  label: categoryInfo.label,
                  href: `/products?category=${categoryInfo.slug}`,
                },
              ]
            : []),
          { label: product.title_zh },
        ]}
      />

      {/* Main product section */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Image gallery */}
        <ImageGallery images={product.images} productTitle={product.title_zh} />

        {/* Product info */}
        <div className="space-y-6">
          {/* Designer */}
          {designer && (
            <Link
              href={`/designers/${designer.slug}`}
              className="inline-block text-xs uppercase tracking-[0.2em] text-brass hover:text-brass-dark transition-colors"
            >
              {designer.name}
            </Link>
          )}

          {/* Title */}
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal leading-tight">
              {product.title_zh}
            </h1>
            <p className="mt-1 text-sm text-walnut/60">{product.title}</p>
          </div>

          {/* Period */}
          {product.period && (
            <p className="text-sm text-walnut/70">
              {product.period}
              {product.style && (
                <span className="ml-2 text-walnut/50">
                  / {product.style.replace(/-/g, " ")}
                </span>
              )}
            </p>
          )}

          {/* Price */}
          <div className="border-y border-linen py-5 space-y-1">
            <p className="text-2xl font-semibold text-charcoal tracking-tight">
              NT$ {product.price_twd.toLocaleString()}
            </p>
            <p className="text-sm text-walnut/50">
              約 &euro;{product.price_eur.toLocaleString()}
            </p>
          </div>

          {/* Shipping & condition badges */}
          <div className="flex flex-wrap gap-3">
            <Badge variant={conditionVariant(product.condition)}>
              {CONDITION_LABELS[product.condition] || product.condition}
            </Badge>
            <Badge>
              <Truck className="mr-1 h-3 w-3" />
              預計 {shippingEstimate} 到貨
            </Badge>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <Button size="lg" className="w-full gap-2">
              <MessageSquare className="h-4 w-4" />
              立即詢價
            </Button>
            <Button variant="secondary" size="lg" className="w-full gap-2">
              <ShoppingBag className="h-4 w-4" />
              加入購物車
            </Button>
            <Button variant="outline" size="lg" className="w-full gap-2">
              <Heart className="h-4 w-4" />
              加入收藏
            </Button>
          </div>

          {/* Trust signals */}
          <div className="flex items-center gap-2 text-xs text-walnut/60 pt-2">
            <Shield className="h-3.5 w-3.5" />
            <span>品質保證 - 所有商品均經過專業鑑定</span>
          </div>

          {/* Dealer info */}
          {dealer && (
            <Card className="mt-6">
              <CardContent className="pt-5">
                <h3 className="text-sm font-medium text-charcoal">經銷商資訊</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-walnut/70">名稱</span>
                    <span className="text-charcoal font-medium">{dealer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-walnut/70">國家</span>
                    <span className="text-charcoal">{dealer.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-walnut/70">可靠度</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= 4 ? "text-brass" : "text-linen"}
                        >
                          &#9733;
                        </span>
                      ))}
                      <span className="ml-1 text-walnut/50 text-xs">4.0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Product tabs */}
      <div className="mt-16 border-t border-linen pt-8">
        <ProductTabs product={product} />
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-linen pt-12">
          <h2 className="font-serif text-2xl font-bold text-charcoal">
            您可能也喜歡
          </h2>
          <p className="mt-2 text-sm text-walnut/60">
            探索更多相似風格的設計
          </p>
          <div className="mt-8">
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        </div>
      )}
    </div>
  );
}
