'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ORDER_STATUS_LABELS } from '@/lib/constants';
import { ShoppingBag } from 'lucide-react';
import type { OrderStatus } from '@/lib/types';

interface MockOrder {
  id: string;
  order_number: string;
  status: OrderStatus;
  total_twd: number;
  created_at: string;
  product: {
    title_zh: string;
    title: string;
    slug: string;
  };
}

const mockOrders: MockOrder[] = [
  {
    id: 'ord-001',
    order_number: 'MOB-20250312-001',
    status: 'in_transit',
    total_twd: 128000,
    created_at: '2025-03-12T10:00:00Z',
    product: {
      title_zh: 'Arne Jacobsen 蛋椅',
      title: 'Arne Jacobsen Egg Chair',
      slug: 'egg-chair',
    },
  },
  {
    id: 'ord-002',
    order_number: 'MOB-20250228-002',
    status: 'customs',
    total_twd: 95000,
    created_at: '2025-02-28T14:00:00Z',
    product: {
      title_zh: 'Hans Wegner 孔雀椅',
      title: 'Hans Wegner Peacock Chair',
      slug: 'peacock-chair',
    },
  },
  {
    id: 'ord-003',
    order_number: 'MOB-20250215-003',
    status: 'delivered',
    total_twd: 76000,
    created_at: '2025-02-15T09:00:00Z',
    product: {
      title_zh: 'Poul Henningsen PH5 吊燈',
      title: 'Poul Henningsen PH5 Pendant',
      slug: 'ph5-lamp',
    },
  },
  {
    id: 'ord-004',
    order_number: 'MOB-20250110-004',
    status: 'delivered',
    total_twd: 112000,
    created_at: '2025-01-10T16:00:00Z',
    product: {
      title_zh: 'Finn Juhl 酋長椅',
      title: 'Finn Juhl Chieftain Chair',
      slug: 'chieftain-chair',
    },
  },
  {
    id: 'ord-005',
    order_number: 'MOB-20241220-005',
    status: 'cancelled',
    total_twd: 68000,
    created_at: '2024-12-20T11:00:00Z',
    product: {
      title_zh: 'Alvar Aalto 花瓶',
      title: 'Alvar Aalto Savoy Vase',
      slug: 'aalto-vase',
    },
  },
];

type FilterTab = 'all' | 'active' | 'completed' | 'cancelled';

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '進行中' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
];

function getStatusBadgeVariant(
  status: OrderStatus
): 'success' | 'warning' | 'error' | 'info' | 'default' {
  switch (status) {
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    case 'pending':
      return 'default';
    default:
      return 'warning';
  }
}

const activeStatuses: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipped',
  'in_transit',
  'customs',
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filteredOrders = mockOrders.filter((order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return activeStatuses.includes(order.status);
    if (activeTab === 'completed') return order.status === 'delivered';
    if (activeTab === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-charcoal">
        我的訂單
      </h2>
      <p className="mt-2 text-sm text-walnut/70">查看訂單狀態與物流追蹤</p>

      {/* Filter Tabs */}
      <div className="mt-6 flex gap-1 border-b border-linen">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-brass text-brass'
                : 'text-walnut/60 hover:text-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order Cards */}
      {filteredOrders.length > 0 ? (
        <div className="mt-6 space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {/* Product Thumbnail */}
                    <div className="h-20 w-20 shrink-0 bg-linen flex items-center justify-center">
                      <span className="font-serif text-xs text-walnut/30">
                        MOBEL
                      </span>
                    </div>

                    {/* Order Info */}
                    <div>
                      <p className="font-serif text-base font-semibold text-charcoal">
                        {order.product.title_zh}
                      </p>
                      <p className="mt-0.5 text-xs text-walnut/60">
                        {order.product.title}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-walnut/60">
                        <span>訂單編號：{order.order_number}</span>
                        <span>
                          {new Date(order.created_at).toLocaleDateString(
                            'zh-TW'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status and Price */}
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                    <p className="text-base font-semibold text-charcoal">
                      NT$ {order.total_twd.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-3">
                  {activeStatuses.includes(order.status) && (
                    <Link href={`/account/orders/${order.id}/tracking`}>
                      <Button variant="outline" size="sm">
                        物流追蹤
                      </Button>
                    </Link>
                  )}
                  <Link href={`/account/orders/${order.id}/tracking`}>
                    <Button variant="ghost" size="sm">
                      查看詳情
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="h-12 w-12 text-walnut/20" />
          <p className="mt-4 text-walnut/60">您還沒有任何訂單</p>
          <p className="mt-1 text-sm text-walnut/40">
            瀏覽我們精選的歐洲古董家具，開始您的收藏之旅
          </p>
          <Link href="/products" className="mt-6">
            <Button>瀏覽商品</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
