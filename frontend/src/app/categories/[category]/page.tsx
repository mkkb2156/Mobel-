'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CATEGORIES, STYLES, CONDITION_LABELS } from '@/lib/constants';
import { SlidersHorizontal } from 'lucide-react';
import type { Product } from '@/lib/types';

const categoryDescriptions: Record<string, string> = {
  seating:
    '從丹麥經典扶手椅到義大利設計師沙發，探索跨越世紀的歐洲座椅藝術。',
  tables:
    '餐桌、茶几、書桌——每一張桌子都是工藝與設計的完美結合。',
  storage:
    '書櫃、餐邊櫃、衣櫃——兼具收納功能與美感的經典儲物家具。',
  lighting:
    '從 PH 燈具到 Arco 立燈，照亮空間的同時也照亮設計歷史。',
  decor:
    '花瓶、鏡子、掛鐘——為您的空間增添獨特的歐洲風情。',
  outdoor:
    '經得起風雨考驗的經典戶外家具，讓花園也擁有設計感。',
};

const subcategories: Record<string, string[]> = {
  seating: ['扶手椅', '餐椅', '沙發', '躺椅', '長凳', '辦公椅'],
  tables: ['餐桌', '茶几', '書桌', '邊桌', '玄關桌', '會議桌'],
  storage: ['書櫃', '餐邊櫃', '衣櫃', '置物架', '抽屜櫃', '電視櫃'],
  lighting: ['吊燈', '立燈', '桌燈', '壁燈', '檯燈'],
  decor: ['花瓶', '鏡子', '掛鐘', '雕塑', '擺飾'],
  outdoor: ['花園椅', '戶外桌', '涼亭', '花盆'],
};

// Mock products for the category
function generateMockProducts(category: string): Product[] {
  const titles: Record<string, Array<{ zh: string; en: string; price: number }>> = {
    seating: [
      { zh: 'Arne Jacobsen 蛋椅', en: 'Egg Chair', price: 128000 },
      { zh: 'Hans Wegner Y 椅', en: 'Wishbone Chair', price: 48000 },
      { zh: 'Finn Juhl 酋長椅', en: 'Chieftain Chair', price: 195000 },
      { zh: 'Eames 休閒椅', en: 'Eames Lounge Chair', price: 168000 },
      { zh: 'Borge Mogensen 西班牙椅', en: 'Spanish Chair', price: 82000 },
      { zh: 'Verner Panton 椅', en: 'Panton Chair', price: 35000 },
    ],
    tables: [
      { zh: 'Hans Wegner AT312 餐桌', en: 'AT312 Dining Table', price: 145000 },
      { zh: 'Isamu Noguchi 茶几', en: 'Noguchi Coffee Table', price: 75000 },
      { zh: 'Gio Ponti 書桌', en: 'Ponti Writing Desk', price: 92000 },
      { zh: 'Alvar Aalto 邊桌', en: 'Aalto Side Table', price: 38000 },
      { zh: 'Le Corbusier LC6 餐桌', en: 'LC6 Table', price: 120000 },
      { zh: 'Eero Saarinen 鬱金香桌', en: 'Tulip Table', price: 85000 },
    ],
    lighting: [
      { zh: 'PH5 吊燈', en: 'PH5 Pendant', price: 76000 },
      { zh: 'Arco 立燈', en: 'Arco Floor Lamp', price: 95000 },
      { zh: 'AJ 桌燈', en: 'AJ Table Lamp', price: 32000 },
      { zh: 'Flowerpot VP1 吊燈', en: 'Flowerpot VP1', price: 28000 },
      { zh: 'PH Artichoke 吊燈', en: 'PH Artichoke', price: 185000 },
      { zh: 'Tolomeo 桌燈', en: 'Tolomeo Desk Lamp', price: 22000 },
    ],
    storage: [
      { zh: 'Kai Kristiansen 餐邊櫃', en: 'Sideboard', price: 88000 },
      { zh: 'Borge Mogensen 書櫃', en: 'Bookcase', price: 72000 },
      { zh: 'Charlotte Perriand 置物架', en: 'Shelving Unit', price: 135000 },
      { zh: 'Arne Vodder 抽屜櫃', en: 'Chest of Drawers', price: 65000 },
      { zh: 'Hans Wegner 衣櫃', en: 'Wardrobe', price: 152000 },
      { zh: 'Finn Juhl 電視櫃', en: 'Media Console', price: 78000 },
    ],
    decor: [
      { zh: 'Alvar Aalto 花瓶', en: 'Savoy Vase', price: 28000 },
      { zh: 'Georg Jensen 銀碗', en: 'Silver Bowl', price: 45000 },
      { zh: 'Henning Koppel 時鐘', en: 'Wall Clock', price: 38000 },
      { zh: 'Arne Jacobsen 掛鐘', en: 'City Hall Clock', price: 22000 },
    ],
    outdoor: [
      { zh: 'Fermob 花園椅', en: 'Luxembourg Chair', price: 15000 },
      { zh: 'Skagerak 戶外長凳', en: 'Outdoor Bench', price: 42000 },
      { zh: 'Kettal 戶外桌', en: 'Outdoor Table', price: 65000 },
    ],
  };

  const items = titles[category] || titles.seating;
  const conditions: Array<'excellent' | 'good' | 'fair' | 'restored'> = [
    'excellent', 'good', 'fair', 'restored',
  ];
  const styleKeys = ['mid-century', 'scandinavian', 'bauhaus', 'art-deco'];

  return items.map((item, i) => ({
    id: `${category}-${i}`,
    slug: item.en.toLowerCase().replace(/\s+/g, '-'),
    title: item.en,
    title_zh: item.zh,
    description: null,
    description_zh: null,
    price_eur: Math.round(item.price / 40),
    price_twd: item.price,
    category,
    style: styleKeys[i % styleKeys.length],
    period: `${1940 + i * 5}`,
    condition: conditions[i % conditions.length],
    dimensions: { width: 60 + i * 10, height: 70 + i * 5, depth: 50 + i * 5, unit: 'cm' as const },
    materials: ['wood', 'metal'],
    images: [],
    designer_id: `d${i + 1}`,
    dealer_id: null,
    source_url: null,
    status: 'active' as const,
    featured: i < 2,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  }));
}

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const categoryData = CATEGORIES.find((c) => c.slug === category);
  const label = categoryData?.label || category;
  const description = categoryDescriptions[category] || '';
  const subs = subcategories[category] || [];

  const allProducts = useMemo(
    () => generateMockProducts(category),
    [category]
  );

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (selectedStyle) {
      result = result.filter((p) => p.style === selectedStyle);
    }

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price_twd - b.price_twd);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price_twd - a.price_twd);
        break;
      case 'newest':
      default:
        break;
    }

    return result;
  }, [allProducts, selectedStyle, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-walnut/60">
        <Link href="/products" className="hover:text-brass transition-colors">
          所有商品
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{label}</span>
      </nav>

      {/* Category Hero */}
      <div className="mt-6">
        <h1 className="font-serif text-4xl font-bold text-charcoal">
          {label}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-walnut/70">{description}</p>
        )}
      </div>

      {/* Subcategory Chips */}
      {subs.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSubcategory(null)}
            className={`px-4 py-1.5 text-sm transition-colors ${
              !selectedSubcategory
                ? 'bg-charcoal text-cream'
                : 'bg-linen text-walnut hover:bg-walnut/10'
            }`}
          >
            全部
          </button>
          {subs.map((sub) => (
            <button
              key={sub}
              onClick={() =>
                setSelectedSubcategory(
                  selectedSubcategory === sub ? null : sub
                )
              }
              className={`px-4 py-1.5 text-sm transition-colors ${
                selectedSubcategory === sub
                  ? 'bg-charcoal text-cream'
                  : 'bg-linen text-walnut hover:bg-walnut/10'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Filters & Sort */}
      <div className="mt-8 flex items-center justify-between border-b border-linen pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          篩選
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-walnut/60">排序：</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-linen bg-white px-3 py-1.5 text-sm text-charcoal focus:border-brass focus:outline-none"
          >
            <option value="newest">最新上架</option>
            <option value="price_asc">價格由低到高</option>
            <option value="price_desc">價格由高到低</option>
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="border-b border-linen py-4">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-walnut/60 mb-2">
                風格
              </p>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style.slug}
                    onClick={() =>
                      setSelectedStyle(
                        selectedStyle === style.slug ? null : style.slug
                      )
                    }
                    className={`px-3 py-1 text-xs transition-colors ${
                      selectedStyle === style.slug
                        ? 'bg-brass text-cream'
                        : 'bg-linen text-walnut hover:bg-walnut/10'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="mt-4 text-sm text-walnut/60">
        共 {filteredProducts.length} 件商品
      </p>

      {/* Product Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <Card hover className="group">
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
              <div className="p-4">
                {product.style && (
                  <p className="text-xs uppercase tracking-wider text-brass">
                    {STYLES.find((s) => s.slug === product.style)?.label ||
                      product.style}
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
            </Card>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="mt-12 text-center py-16">
          <p className="text-walnut/60">此分類暫無符合條件的商品</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSelectedStyle(null);
              setSelectedSubcategory(null);
            }}
          >
            清除篩選
          </Button>
        </div>
      )}
    </div>
  );
}
