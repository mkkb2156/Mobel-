'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Search } from 'lucide-react';

interface DesignerEntry {
  slug: string;
  name: string;
  name_zh: string;
  nationality: string;
  era: string;
  productCount: number;
}

const mockDesigners: DesignerEntry[] = [
  { slug: 'alvar-aalto', name: 'Alvar Aalto', name_zh: '阿爾瓦·阿爾托', nationality: '芬蘭', era: '1898-1976', productCount: 8 },
  { slug: 'arne-jacobsen', name: 'Arne Jacobsen', name_zh: '阿納·雅各布森', nationality: '丹麥', era: '1902-1971', productCount: 12 },
  { slug: 'borge-mogensen', name: 'Borge Mogensen', name_zh: '博爾格·莫根森', nationality: '丹麥', era: '1914-1972', productCount: 6 },
  { slug: 'charles-eames', name: 'Charles & Ray Eames', name_zh: '查爾斯與蕾·伊姆斯', nationality: '美國', era: '1907-1978', productCount: 15 },
  { slug: 'eileen-gray', name: 'Eileen Gray', name_zh: '艾琳·格雷', nationality: '愛爾蘭', era: '1878-1976', productCount: 4 },
  { slug: 'finn-juhl', name: 'Finn Juhl', name_zh: '芬·尤爾', nationality: '丹麥', era: '1912-1989', productCount: 9 },
  { slug: 'hans-wegner', name: 'Hans J. Wegner', name_zh: '漢斯·韋格納', nationality: '丹麥', era: '1914-2007', productCount: 18 },
  { slug: 'le-corbusier', name: 'Le Corbusier', name_zh: '勒·柯比意', nationality: '瑞士/法國', era: '1887-1965', productCount: 7 },
  { slug: 'ludwig-mies-van-der-rohe', name: 'Ludwig Mies van der Rohe', name_zh: '密斯·凡德羅', nationality: '德國/美國', era: '1886-1969', productCount: 5 },
  { slug: 'poul-henningsen', name: 'Poul Henningsen', name_zh: '保爾·漢寧森', nationality: '丹麥', era: '1894-1967', productCount: 11 },
  { slug: 'verner-panton', name: 'Verner Panton', name_zh: '維爾納·潘頓', nationality: '丹麥', era: '1926-1998', productCount: 7 },
  { slug: 'gio-ponti', name: 'Gio Ponti', name_zh: '吉奧·龐蒂', nationality: '義大利', era: '1891-1979', productCount: 6 },
];

export default function DesignersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDesigners = useMemo(() => {
    if (!searchQuery.trim()) return mockDesigners;
    const q = searchQuery.toLowerCase();
    return mockDesigners.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.name_zh.includes(q) ||
        d.nationality.includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-bold text-charcoal">
          設計師
        </h1>
        <p className="mt-3 text-walnut/70">
          探索二十世紀歐洲經典家具設計大師
        </p>
      </div>

      {/* Search */}
      <div className="mx-auto mt-10 max-w-md relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-walnut/40" />
        <input
          type="text"
          placeholder="搜尋設計師名稱或國籍..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-linen bg-white py-3 pl-11 pr-4 text-sm text-charcoal placeholder:text-walnut/40 focus:border-brass focus:outline-none"
        />
      </div>

      {/* Designer Grid */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDesigners.map((designer) => (
          <Link key={designer.slug} href={`/designers/${designer.slug}`}>
            <Card hover className="h-full">
              <div className="aspect-[4/3] bg-linen flex items-center justify-center">
                <span className="font-serif text-3xl font-bold text-walnut/10">
                  {designer.name.charAt(0)}
                </span>
              </div>
              <CardContent className="p-5">
                <h3 className="font-serif text-lg font-semibold text-charcoal">
                  {designer.name}
                </h3>
                <p className="mt-0.5 text-sm text-walnut/60">
                  {designer.name_zh}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-walnut/50">
                  <span>
                    {designer.nationality} / {designer.era}
                  </span>
                  <span>{designer.productCount} 件作品</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredDesigners.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-walnut/60">
            找不到符合「{searchQuery}」的設計師
          </p>
        </div>
      )}
    </div>
  );
}
