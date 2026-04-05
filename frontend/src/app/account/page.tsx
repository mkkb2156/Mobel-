'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ShoppingBag,
  Truck,
  Heart,
  DollarSign,
  ChevronRight,
  Bell,
  BellOff,
} from 'lucide-react';
import { ORDER_STATUS_LABELS } from '@/lib/constants';

// Mock user data
const mockUser = {
  id: 'u1',
  full_name: '林雅芳',
  email: 'yafang@example.com',
  phone: '0912-345-678',
  avatar_url: null,
  role: 'customer' as const,
  created_at: '2024-06-15T00:00:00Z',
  tier: 'silver' as const,
};

const tierConfig = {
  bronze: { label: '銅卡會員', color: 'bg-amber-700 text-white' },
  silver: { label: '銀卡會員', color: 'bg-gray-400 text-white' },
  gold: { label: '金卡會員', color: 'bg-amber-500 text-white' },
};

const mockStats = {
  totalOrders: 8,
  activeOrders: 2,
  wishlistCount: 5,
  totalSpent: 486000,
};

const mockRecentOrders: Array<{
  id: string;
  order_number: string;
  status: string;
  total_twd: number;
  created_at: string;
  product: { title_zh: string; slug: string };
}> = [
  {
    id: 'ord-001',
    order_number: 'MOB-20250312-001',
    status: 'in_transit',
    total_twd: 128000,
    created_at: '2025-03-12T10:00:00Z',
    product: { title_zh: 'Arne Jacobsen 蛋椅', slug: 'egg-chair' },
  },
  {
    id: 'ord-002',
    order_number: 'MOB-20250228-002',
    status: 'delivered',
    total_twd: 95000,
    created_at: '2025-02-28T14:00:00Z',
    product: { title_zh: 'Hans Wegner 孔雀椅', slug: 'peacock-chair' },
  },
  {
    id: 'ord-003',
    order_number: 'MOB-20250215-003',
    status: 'delivered',
    total_twd: 76000,
    created_at: '2025-02-15T09:00:00Z',
    product: { title_zh: 'Poul Henningsen PH5 吊燈', slug: 'ph5-lamp' },
  },
];

const mockRecentInquiries = [
  {
    id: 'inq-001',
    product: { title_zh: 'Finn Juhl 酋長椅' },
    status: 'replied' as const,
    created_at: '2025-03-10T08:00:00Z',
    message: '想了解這張椅子的實際皮革狀況...',
  },
  {
    id: 'inq-002',
    product: { title_zh: 'Alvar Aalto 花瓶' },
    status: 'open' as const,
    created_at: '2025-03-08T15:00:00Z',
    message: '請問是否可以提供更多角度的照片？',
  },
  {
    id: 'inq-003',
    product: { title_zh: 'Børge Mogensen 沙發' },
    status: 'closed' as const,
    created_at: '2025-02-20T11:00:00Z',
    message: '想詢問這組沙發的配送時間...',
  },
];

const inquiryStatusConfig: Record<string, { label: string; variant: 'info' | 'success' | 'default' }> = {
  open: { label: '待回覆', variant: 'info' },
  replied: { label: '已回覆', variant: 'success' },
  closed: { label: '已結案', variant: 'default' },
};

export default function AccountPage() {
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newArrivals: true,
  });

  const tier = tierConfig[mockUser.tier];

  return (
    <div>
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-charcoal">
            歡迎回來，{mockUser.full_name}
          </h2>
          <p className="mt-1 text-sm text-walnut/70">
            管理您的帳戶、訂單與收藏
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wider ${tier.color}`}
        >
          {tier.label}
        </span>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: '總訂單',
            value: mockStats.totalOrders,
            icon: ShoppingBag,
          },
          {
            label: '進行中',
            value: mockStats.activeOrders,
            icon: Truck,
          },
          {
            label: '收藏數',
            value: mockStats.wishlistCount,
            icon: Heart,
          },
          {
            label: '累計消費',
            value: `NT$ ${mockStats.totalSpent.toLocaleString()}`,
            icon: DollarSign,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-brass/10">
                  <stat.icon className="h-5 w-5 text-brass" />
                </div>
                <div>
                  <p className="text-xs text-walnut/60">{stat.label}</p>
                  <p className="text-lg font-semibold text-charcoal">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-charcoal">
            最近訂單
          </h3>
          <Link
            href="/account/orders"
            className="flex items-center gap-1 text-sm text-brass hover:text-brass-dark transition-colors"
          >
            查看全部
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {mockRecentOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 shrink-0 bg-linen" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {order.product.title_zh}
                    </p>
                    <p className="text-xs text-walnut/60">
                      {order.order_number} /{' '}
                      {new Date(order.created_at).toLocaleDateString('zh-TW')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      order.status === 'delivered'
                        ? 'success'
                        : order.status === 'cancelled'
                          ? 'error'
                          : 'warning'
                    }
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                  <span className="text-sm font-medium text-charcoal">
                    NT$ {order.total_twd.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-charcoal">
            最近詢問
          </h3>
          <Link
            href="/account/inquiries"
            className="flex items-center gap-1 text-sm text-brass hover:text-brass-dark transition-colors"
          >
            查看全部
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {mockRecentInquiries.map((inquiry) => (
            <Card key={inquiry.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    {inquiry.product.title_zh}
                  </p>
                  <p className="mt-1 text-xs text-walnut/60 line-clamp-1">
                    {inquiry.message}
                  </p>
                </div>
                <Badge variant={inquiryStatusConfig[inquiry.status].variant}>
                  {inquiryStatusConfig[inquiry.status].label}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="mt-10">
        <h3 className="font-serif text-lg font-semibold text-charcoal">
          通知偏好
        </h3>
        <Card className="mt-4">
          <CardContent className="divide-y divide-linen p-0">
            {[
              {
                key: 'orderUpdates' as const,
                label: '訂單狀態更新',
                description: '當訂單狀態變更時收到通知',
              },
              {
                key: 'promotions' as const,
                label: '優惠活動',
                description: '接收最新優惠與促銷訊息',
              },
              {
                key: 'newArrivals' as const,
                label: '新品到貨',
                description: '當有新的歐洲古董家具上架時通知',
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  {notifications[item.key] ? (
                    <Bell className="h-4 w-4 text-brass" />
                  ) : (
                    <BellOff className="h-4 w-4 text-walnut/40" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {item.label}
                    </p>
                    <p className="text-xs text-walnut/60">
                      {item.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant={notifications[item.key] ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key],
                    }))
                  }
                >
                  {notifications[item.key] ? '已開啟' : '已關閉'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
