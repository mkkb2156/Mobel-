'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Heart, X } from 'lucide-react';
import { CONDITION_LABELS } from '@/lib/constants';
import type { Product } from '@/lib/types';

const mockWishlistProducts: Product[] = [
  {
    id: 'p1',
    slug: 'egg-chair',
    title: 'Arne Jacobsen Egg Chair',
    title_zh: 'Arne Jacobsen 蛋椅',
    description: null,
    description_zh: null,
    price_eur: 3200,
    price_twd: 128000,
    category: 'seating',
    style: 'mid-century',
    period: '1958',
    condition: 'excellent',
    dimensions: { width: 86, height: 107, depth: 79, unit: 'cm' },
    materials: ['fabric', 'aluminum'],
    images: [],
    designer_id: 'd1',
    dealer_id: null,
    source_url: null,
    status: 'active',
    featured: true,
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2025-01-10T00:00:00Z',
  },
  {
    id: 'p2',
    slug: 'ph5-pendant',
    title: 'Poul Henningsen PH5 Pendant',
    title_zh: 'Poul Henningsen PH5 吊燈',
    description: null,
    description_zh: null,
    price_eur: 1900,
    price_twd: 76000,
    category: 'lighting',
    style: 'scandinavian',
    period: '1958',
    condition: 'good',
    dimensions: { width: 50, height: 28, depth: 50, unit: 'cm' },
    materials: ['aluminum'],
    images: [],
    designer_id: 'd2',
    dealer_id: null,
    source_url: null,
    status: 'active',
    featured: false,
    created_at: '2025-02-05T00:00:00Z',
    updated_at: '2025-02-05T00:00:00Z',
  },
  {
    id: 'p3',
    slug: 'wishbone-chair',
    title: 'Hans Wegner Wishbone Chair',
    title_zh: 'Hans Wegner Y 椅',
    description: null,
    description_zh: null,
    price_eur: 1200,
    price_twd: 48000,
    category: 'seating',
    style: 'scandinavian',
    period: '1949',
    condition: 'restored',
    dimensions: { width: 55, height: 76, depth: 51, unit: 'cm' },
    materials: ['oak', 'paper cord'],
    images: [],
    designer_id: 'd3',
    dealer_id: null,
    source_url: null,
    status: 'active',
    featured: true,
    created_at: '2025-02-20T00:00:00Z',
    updated_at: '2025-02-20T00:00:00Z',
  },
  {
    id: 'p4',
    slug: 'barcelona-chair',
    title: 'Mies van der Rohe Barcelona Chair',
    title_zh: 'Mies van der Rohe 巴塞隆納椅',
    description: null,
    description_zh: null,
    price_eur: 2800,
    price_twd: 112000,
    category: 'seating',
    style: 'bauhaus',
    period: '1929',
    condition: 'good',
    dimensions: { width: 75, height: 77, depth: 77, unit: 'cm' },
    materials: ['leather', 'stainless steel'],
    images: [],
    designer_id: 'd4',
    dealer_id: null,
    source_url: null,
    status: 'active',
    featured: false,
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-03-01T00:00:00Z',
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState(mockWishlistProducts);

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-charcoal">
        收藏清單
      </h2>
      <p className="mt-2 text-sm text-walnut/70">
        您收藏的歐洲古董家具（{items.length} 件）
      </p>

      {items.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((product) => (
            <Card key={product.id} hover className="group relative">
              {/* Remove button */}
              <button
                onClick={() => removeItem(product.id)}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center bg-white/90 text-walnut/60 hover:bg-error hover:text-cream transition-colors"
                aria-label="移除收藏"
              >
                <X className="h-4 w-4" />
              </button>

              <Link href={`/products/${product.slug}`}>
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-linen">
                  <div className="flex h-full items-center justify-center text-walnut/30">
                    <span className="font-serif text-lg">MOBEL</span>
                  </div>

                  {product.condition && (
                    <div className="absolute bottom-3 left-3">
                      <Badge>
                        {CONDITION_LABELS[product.condition] ||
                          product.condition}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  {product.style && (
                    <p className="text-xs uppercase tracking-wider text-brass">
                      {product.style}
                    </p>
                  )}
                  <h3 className="mt-1 font-serif text-base font-semibold leading-tight text-charcoal">
                    {product.title_zh}
                  </h3>
                  <p className="mt-0.5 text-xs text-walnut/70">
                    {product.title}
                  </p>
                  <p className="mt-2 text-sm font-medium text-charcoal">
                    NT$ {product.price_twd.toLocaleString()}
                  </p>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
          <Heart className="h-12 w-12 text-walnut/20" />
          <p className="mt-4 text-walnut/60">收藏清單是空的</p>
          <p className="mt-1 text-sm text-walnut/40">
            瀏覽商品時點擊愛心圖示即可加入收藏
          </p>
          <Link href="/products" className="mt-6">
            <Button>瀏覽商品</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
