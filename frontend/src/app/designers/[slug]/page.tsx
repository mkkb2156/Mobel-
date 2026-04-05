import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CONDITION_LABELS } from '@/lib/constants';
import type { Product, Designer } from '@/lib/types';

interface DesignerDetailPageProps {
  params: Promise<{ slug: string }>;
}

const mockDesigner: Designer = {
  id: 'd1',
  slug: 'arne-jacobsen',
  name: 'Arne Jacobsen',
  name_zh: '阿納·雅各布森',
  bio: 'Arne Jacobsen was a Danish architect and furniture designer. He is remembered for his contribution to architectural Functionalism and for the worldwide success of his furniture designs such as the Egg, the Swan, and the Series 7 chair.',
  bio_zh:
    'Arne Jacobsen（1902-1971）是丹麥建築師暨家具設計師，被譽為丹麥現代主義的代表人物。他的設計融合了功能主義與有機形態，創造出無數經典作品。蛋椅（Egg Chair）、天鵝椅（Swan Chair）和 Series 7 椅是他最具代表性的家具設計，至今仍由 Fritz Hansen 持續生產。Jacobsen 不僅在家具設計領域成就非凡，他同時也是一位傑出的建築師，SAS Royal Hotel 是他建築與室內設計完美結合的代表作。',
  country: '丹麥',
  born_year: 1902,
  died_year: 1971,
  image_url: null,
  created_at: '2024-01-01T00:00:00Z',
};

const mockProducts: Product[] = [
  {
    id: 'p1',
    slug: 'egg-chair',
    title: 'Egg Chair',
    title_zh: '蛋椅',
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
    slug: 'swan-chair',
    title: 'Swan Chair',
    title_zh: '天鵝椅',
    description: null,
    description_zh: null,
    price_eur: 2800,
    price_twd: 112000,
    category: 'seating',
    style: 'mid-century',
    period: '1958',
    condition: 'good',
    dimensions: { width: 74, height: 77, depth: 68, unit: 'cm' },
    materials: ['fabric', 'aluminum'],
    images: [],
    designer_id: 'd1',
    dealer_id: null,
    source_url: null,
    status: 'active',
    featured: false,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
  },
  {
    id: 'p3',
    slug: 'series-7-chair',
    title: 'Series 7 Chair',
    title_zh: 'Series 7 椅',
    description: null,
    description_zh: null,
    price_eur: 450,
    price_twd: 18000,
    category: 'seating',
    style: 'mid-century',
    period: '1955',
    condition: 'restored',
    dimensions: { width: 50, height: 82, depth: 52, unit: 'cm' },
    materials: ['plywood', 'steel'],
    images: [],
    designer_id: 'd1',
    dealer_id: null,
    source_url: null,
    status: 'active',
    featured: false,
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-02-01T00:00:00Z',
  },
  {
    id: 'p4',
    slug: 'ant-chair',
    title: 'Ant Chair',
    title_zh: '螞蟻椅',
    description: null,
    description_zh: null,
    price_eur: 380,
    price_twd: 15200,
    category: 'seating',
    style: 'mid-century',
    period: '1952',
    condition: 'good',
    dimensions: { width: 52, height: 79, depth: 48, unit: 'cm' },
    materials: ['plywood', 'steel'],
    images: [],
    designer_id: 'd1',
    dealer_id: null,
    source_url: null,
    status: 'active',
    featured: false,
    created_at: '2025-02-10T00:00:00Z',
    updated_at: '2025-02-10T00:00:00Z',
  },
];

export default async function DesignerDetailPage({
  params,
}: DesignerDetailPageProps) {
  const { slug } = await params;

  // In production, fetch designer data based on slug
  const designer = mockDesigner;
  const products = mockProducts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-walnut/60">
        <Link href="/designers" className="hover:text-brass transition-colors">
          設計師
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{designer.name}</span>
      </nav>

      {/* Designer Bio */}
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Portrait placeholder */}
        <div className="aspect-[3/4] bg-linen flex items-center justify-center lg:col-span-1">
          <span className="font-serif text-6xl font-bold text-walnut/10">
            {designer.name.charAt(0)}
          </span>
        </div>

        {/* Bio text */}
        <div className="lg:col-span-2">
          <h1 className="font-serif text-4xl font-bold text-charcoal">
            {designer.name}
          </h1>
          <p className="mt-1 text-lg text-walnut/60">{designer.name_zh}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-walnut/70">
            {designer.country && (
              <span className="flex items-center gap-1">
                <span className="font-medium text-charcoal">國籍：</span>
                {designer.country}
              </span>
            )}
            {designer.born_year && (
              <span className="flex items-center gap-1">
                <span className="font-medium text-charcoal">年代：</span>
                {designer.born_year}
                {designer.died_year ? `-${designer.died_year}` : ' -'}
              </span>
            )}
          </div>

          <div className="mt-6 space-y-4 leading-relaxed text-walnut/80">
            {designer.bio_zh?.split('。').filter(Boolean).map((sentence, i) => (
              <p key={i}>{sentence}。</p>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mt-16">
        <h2 className="font-serif text-2xl font-semibold text-charcoal">
          {designer.name} 的作品
        </h2>
        <p className="mt-2 text-sm text-walnut/60">
          共 {products.length} 件可購買的作品
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
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
                  <p className="text-xs uppercase tracking-wider text-brass">
                    {product.period}
                  </p>
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
      </div>
    </div>
  );
}
