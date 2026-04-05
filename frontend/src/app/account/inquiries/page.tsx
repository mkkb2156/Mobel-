'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface MockInquiry {
  id: string;
  product: {
    title_zh: string;
    title: string;
    slug: string;
  };
  message: string;
  reply: string | null;
  status: 'open' | 'replied' | 'closed';
  created_at: string;
  updated_at: string;
}

const mockInquiries: MockInquiry[] = [
  {
    id: 'inq-001',
    product: {
      title_zh: 'Finn Juhl 酋長椅',
      title: 'Finn Juhl Chieftain Chair',
      slug: 'chieftain-chair',
    },
    message:
      '想了解這張椅子的實際皮革狀況，是否有明顯磨損？另外想確認椅腳的木材是否為原裝。',
    reply:
      '您好！這張酋長椅的皮革保存狀態極佳，僅有輕微的自然皮紋。椅腳為原裝柚木，已由專業師傅重新打磨上油。我們會在收到商品後拍攝更詳細的照片提供給您確認。',
    status: 'replied',
    created_at: '2025-03-10T08:00:00Z',
    updated_at: '2025-03-11T14:00:00Z',
  },
  {
    id: 'inq-002',
    product: {
      title_zh: 'Alvar Aalto 花瓶',
      title: 'Alvar Aalto Savoy Vase',
      slug: 'aalto-vase',
    },
    message:
      '請問是否可以提供更多角度的照片？特別想看底部的標記和整體的色澤。',
    reply: null,
    status: 'open',
    created_at: '2025-03-08T15:00:00Z',
    updated_at: '2025-03-08T15:00:00Z',
  },
  {
    id: 'inq-003',
    product: {
      title_zh: 'Borge Mogensen 沙發',
      title: 'Borge Mogensen Spanish Chair',
      slug: 'spanish-chair',
    },
    message:
      '想詢問這組沙發的配送時間，以及是否包含室內定位安裝的服務？台北市信義區。',
    reply:
      '您好！從下單到配送約需 6-8 週（含海運及清關時間）。我們提供白手套配送服務，包含室內定位及基本安裝。台北市信義區屬於我們的標準配送範圍，不另收費用。',
    status: 'closed',
    created_at: '2025-02-20T11:00:00Z',
    updated_at: '2025-02-22T09:00:00Z',
  },
];

const statusConfig: Record<
  string,
  { label: string; variant: 'info' | 'success' | 'default' }
> = {
  open: { label: '待回覆', variant: 'info' },
  replied: { label: '已回覆', variant: 'success' },
  closed: { label: '已結案', variant: 'default' },
};

export default function InquiriesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-charcoal">
        我的詢問
      </h2>
      <p className="mt-2 text-sm text-walnut/70">查看您對商品的詢問記錄</p>

      {mockInquiries.length > 0 ? (
        <div className="mt-8 space-y-4">
          {mockInquiries.map((inquiry) => {
            const config = statusConfig[inquiry.status];
            const isExpanded = expandedId === inquiry.id;

            return (
              <Card key={inquiry.id}>
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      {/* Product Thumbnail */}
                      <div className="h-16 w-16 shrink-0 bg-linen flex items-center justify-center">
                        <span className="font-serif text-xs text-walnut/30">
                          MOBEL
                        </span>
                      </div>

                      <div>
                        <Link
                          href={`/products/${inquiry.product.slug}`}
                          className="font-serif text-base font-semibold text-charcoal hover:text-brass transition-colors"
                        >
                          {inquiry.product.title_zh}
                        </Link>
                        <p className="mt-0.5 text-xs text-walnut/60">
                          詢問日期：
                          {new Date(inquiry.created_at).toLocaleDateString(
                            'zh-TW'
                          )}
                        </p>
                        <p className="mt-2 text-sm text-walnut/70 line-clamp-2">
                          {inquiry.message}
                        </p>
                      </div>
                    </div>

                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>

                  {/* Expand/Collapse */}
                  <button
                    onClick={() => toggleExpand(inquiry.id)}
                    className="mt-3 flex items-center gap-1 text-sm text-brass hover:text-brass-dark transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        收起詳情
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        查看詳情
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 border-t border-linen pt-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-walnut/60">
                          您的詢問
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-charcoal">
                          {inquiry.message}
                        </p>
                      </div>

                      {inquiry.reply && (
                        <div className="bg-brass/5 p-4">
                          <p className="text-xs font-medium uppercase tracking-wider text-brass">
                            MOBEL 回覆
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-charcoal">
                            {inquiry.reply}
                          </p>
                          <p className="mt-2 text-xs text-walnut/50">
                            回覆時間：
                            {new Date(inquiry.updated_at).toLocaleDateString(
                              'zh-TW'
                            )}
                          </p>
                        </div>
                      )}

                      {inquiry.status === 'open' && (
                        <p className="text-sm text-walnut/50 italic">
                          我們將盡快回覆您的詢問，通常在 1-2 個工作天內。
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare className="h-12 w-12 text-walnut/20" />
          <p className="mt-4 text-walnut/60">暫無詢問記錄</p>
          <p className="mt-1 text-sm text-walnut/40">
            瀏覽商品時可透過詢問功能向我們提問
          </p>
          <Link href="/products" className="mt-6">
            <Button>瀏覽商品</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
