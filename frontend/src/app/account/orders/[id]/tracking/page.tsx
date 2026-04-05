import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  ClipboardList,
  CreditCard,
  ShoppingCart,
  PackageCheck,
  CheckCircle,
  Ship,
  Anchor,
  FileText,
  Truck,
  Star,
} from 'lucide-react';
import Link from 'next/link';

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

const trackingSteps = [
  {
    key: 'order_placed',
    title: '訂單成立',
    icon: ClipboardList,
    date: '2025-03-12 10:23',
    description: '您的訂單已成功建立，等待付款確認。',
    completed: true,
  },
  {
    key: 'payment_confirmed',
    title: '付款完成',
    icon: CreditCard,
    date: '2025-03-12 10:45',
    description: '付款已確認，我們將立即安排代購作業。',
    completed: true,
  },
  {
    key: 'purchasing',
    title: '代購執行中',
    icon: ShoppingCart,
    date: '2025-03-13 14:00',
    description: '已向歐洲經銷商下單，等待出貨至歐洲倉庫。',
    completed: true,
  },
  {
    key: 'warehouse_received',
    title: '歐洲倉庫收貨',
    icon: PackageCheck,
    date: '2025-03-18 09:30',
    description: '商品已到達歐洲倉庫，準備進行品質檢驗。',
    completed: true,
  },
  {
    key: 'inspection',
    title: '品質檢驗',
    icon: CheckCircle,
    date: '2025-03-19 16:00',
    description: '品質檢驗通過，商品狀態良好。檢驗照片已寄送至您的信箱。',
    completed: true,
  },
  {
    key: 'shipping',
    title: '海運出貨',
    icon: Ship,
    date: '2025-03-22 08:00',
    description: '商品已裝船出發，預計航程 25-30 天。',
    completed: true,
    current: true,
  },
  {
    key: 'arrived',
    title: '台灣到港',
    icon: Anchor,
    date: null,
    description: '商品抵達台灣港口，等待卸貨。',
    completed: false,
  },
  {
    key: 'customs',
    title: '清關中',
    icon: FileText,
    date: null,
    description: '海關查驗與稅務處理中。',
    completed: false,
  },
  {
    key: 'domestic_delivery',
    title: '國內配送',
    icon: Truck,
    date: null,
    description: '白手套配送服務，將商品安全送達您指定的地址。',
    completed: false,
  },
  {
    key: 'delivered',
    title: '已送達',
    icon: Star,
    date: null,
    description: '商品已送達，享有 7 天驗收期。',
    completed: false,
  },
];

const mockShipment = {
  carrier: 'Evergreen Marine',
  vesselName: 'EVER GIVEN',
  trackingNumber: 'EGLV-2025-0312-TW',
  eta: '2025-04-20',
  origin: '漢堡港，德國',
  destination: '高雄港，台灣',
};

export default async function OrderTrackingPage({
  params,
}: OrderTrackingPageProps) {
  const { id } = await params;

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-charcoal">
        物流追蹤
      </h2>

      {/* Order Summary Card */}
      <Card className="mt-6">
        <CardContent className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 bg-linen flex items-center justify-center">
              <span className="font-serif text-xs text-walnut/30">MOBEL</span>
            </div>
            <div>
              <p className="font-serif text-base font-semibold text-charcoal">
                Arne Jacobsen 蛋椅
              </p>
              <p className="mt-0.5 text-xs text-walnut/60">
                訂單編號：MOB-20250312-001
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant="warning">海運中</Badge>
            <p className="mt-1 text-base font-semibold text-charcoal">
              NT$ 128,000
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Visual Timeline */}
      <div className="mt-8">
        <h3 className="font-serif text-lg font-semibold text-charcoal">
          運送進度
        </h3>

        <div className="mt-6 space-y-0">
          {trackingSteps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === trackingSteps.length - 1;

            return (
              <div key={step.key} className="relative flex gap-4">
                {/* Timeline line and dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                      step.current
                        ? 'border-brass bg-brass text-cream'
                        : step.completed
                          ? 'border-brass bg-brass/10 text-brass'
                          : 'border-linen bg-white text-walnut/30'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 min-h-[2rem] ${
                        step.completed && trackingSteps[index + 1]?.completed
                          ? 'bg-brass'
                          : step.completed
                            ? 'bg-gradient-to-b from-brass to-linen'
                            : 'bg-linen'
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-8 ${!step.completed && !step.current ? 'opacity-50' : ''}`}>
                  <p
                    className={`text-sm font-semibold ${
                      step.current
                        ? 'text-brass'
                        : step.completed
                          ? 'text-charcoal'
                          : 'text-walnut/50'
                    }`}
                  >
                    {step.title}
                    {step.current && (
                      <span className="ml-2 inline-flex items-center">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-brass" />
                      </span>
                    )}
                  </p>
                  {step.date && (
                    <p className="mt-0.5 text-xs text-walnut/60">{step.date}</p>
                  )}
                  <p className="mt-1 text-sm text-walnut/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shipment Details */}
      <Card className="mt-8">
        <CardHeader>
          <h3 className="font-serif text-lg font-semibold text-charcoal">
            運送資訊
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-walnut/60">承運商</p>
              <p className="mt-0.5 text-sm font-medium text-charcoal">
                {mockShipment.carrier}
              </p>
            </div>
            <div>
              <p className="text-xs text-walnut/60">船名</p>
              <p className="mt-0.5 text-sm font-medium text-charcoal">
                {mockShipment.vesselName}
              </p>
            </div>
            <div>
              <p className="text-xs text-walnut/60">追蹤編號</p>
              <p className="mt-0.5 text-sm font-medium text-brass">
                {mockShipment.trackingNumber}
              </p>
            </div>
            <div>
              <p className="text-xs text-walnut/60">預計到港日</p>
              <p className="mt-0.5 text-sm font-medium text-charcoal">
                {new Date(mockShipment.eta).toLocaleDateString('zh-TW')}
              </p>
            </div>
            <div>
              <p className="text-xs text-walnut/60">出發港</p>
              <p className="mt-0.5 text-sm font-medium text-charcoal">
                {mockShipment.origin}
              </p>
            </div>
            <div>
              <p className="text-xs text-walnut/60">目的港</p>
              <p className="mt-0.5 text-sm font-medium text-charcoal">
                {mockShipment.destination}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <div className="mt-6 flex h-64 items-center justify-center border-2 border-dashed border-linen bg-linen/30">
        <div className="text-center">
          <Ship className="mx-auto h-8 w-8 text-walnut/30" />
          <p className="mt-2 text-sm font-medium text-walnut/50">
            航線追蹤地圖
          </p>
          <p className="mt-1 text-xs text-walnut/30">
            漢堡 → 蘇伊士運河 → 新加坡 → 高雄
          </p>
        </div>
      </div>

      {/* Back link */}
      <div className="mt-8">
        <Link
          href="/account/orders"
          className="text-sm text-brass hover:text-brass-dark transition-colors"
        >
          &larr; 返回訂單列表
        </Link>
      </div>
    </div>
  );
}
