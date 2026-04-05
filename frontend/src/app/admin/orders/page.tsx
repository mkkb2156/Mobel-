"use client";

import { useState, Fragment } from "react";
import { Badge } from "@/components/ui/Badge";
import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

interface MockOrder {
  id: string;
  orderNumber: string;
  customer: string;
  customerPhone: string;
  product: string;
  totalTwd: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber: string | null;
  timeline: { date: string; event: string }[];
}

const statusVariants: Record<OrderStatus, "default" | "success" | "warning" | "error" | "info"> = {
  pending: "warning",
  confirmed: "info",
  shipped: "info",
  in_transit: "info",
  customs: "warning",
  delivered: "success",
  cancelled: "error",
};

const mockOrders: MockOrder[] = [
  {
    id: "o1", orderNumber: "MOB-2026-0421", customer: "王小明", customerPhone: "0912-345-678",
    product: "Hans Wegner CH24 Wishbone Chair", totalTwd: 108600, status: "pending", createdAt: "2026-04-05",
    shippingAddress: "台北市大安區忠孝東路四段100號5樓", paymentMethod: "信用卡",
    trackingNumber: null,
    timeline: [{ date: "2026-04-05 14:30", event: "訂單建立" }],
  },
  {
    id: "o2", orderNumber: "MOB-2026-0420", customer: "林美玲", customerPhone: "0923-456-789",
    product: "Arne Jacobsen Egg Chair", totalTwd: 455250, status: "shipped", createdAt: "2026-04-03",
    shippingAddress: "台中市西屯區台灣大道三段99號", paymentMethod: "銀行轉帳",
    trackingNumber: "DHL-TW-98234",
    timeline: [
      { date: "2026-04-03 10:00", event: "訂單建立" },
      { date: "2026-04-03 15:00", event: "付款確認" },
      { date: "2026-04-05 09:00", event: "已出貨" },
    ],
  },
  {
    id: "o3", orderNumber: "MOB-2026-0419", customer: "張志豪", customerPhone: "0934-567-890",
    product: "Poul Henningsen PH 5 Pendant", totalTwd: 74100, status: "customs", createdAt: "2026-04-01",
    shippingAddress: "高雄市前鎮區中山二路260號", paymentMethod: "信用卡",
    trackingNumber: "DHL-TW-97856",
    timeline: [
      { date: "2026-04-01 11:00", event: "訂單建立" },
      { date: "2026-04-01 16:00", event: "付款確認" },
      { date: "2026-04-02 10:00", event: "已出貨" },
      { date: "2026-04-04 08:00", event: "抵達台灣海關" },
    ],
  },
  {
    id: "o4", orderNumber: "MOB-2026-0418", customer: "陳雅琳", customerPhone: "0945-678-901",
    product: "Eero Saarinen Tulip Dining Table", totalTwd: 218100, status: "in_transit", createdAt: "2026-03-28",
    shippingAddress: "新北市板橋區文化路一段200號", paymentMethod: "銀行轉帳",
    trackingNumber: "MAERSK-EU-45231",
    timeline: [
      { date: "2026-03-28 09:00", event: "訂單建立" },
      { date: "2026-03-28 14:00", event: "付款確認" },
      { date: "2026-03-30 10:00", event: "從丹麥出貨" },
      { date: "2026-04-02 06:00", event: "運送中 - 預計4/12抵達" },
    ],
  },
  {
    id: "o5", orderNumber: "MOB-2026-0417", customer: "李建華", customerPhone: "0956-789-012",
    product: "Le Corbusier LC4 Chaise Longue", totalTwd: 325050, status: "delivered", createdAt: "2026-03-15",
    shippingAddress: "台北市信義區松仁路100號", paymentMethod: "信用卡",
    trackingNumber: "DHL-TW-95123",
    timeline: [
      { date: "2026-03-15 10:00", event: "訂單建立" },
      { date: "2026-03-15 14:00", event: "付款確認" },
      { date: "2026-03-17 09:00", event: "已出貨" },
      { date: "2026-03-25 08:00", event: "清關完成" },
      { date: "2026-03-27 14:00", event: "已送達" },
    ],
  },
  {
    id: "o6", orderNumber: "MOB-2026-0416", customer: "黃雅芳", customerPhone: "0967-890-123",
    product: "Finn Juhl Pelican Chair", totalTwd: 542400, status: "confirmed", createdAt: "2026-04-04",
    shippingAddress: "台南市東區中華東路二段89號", paymentMethod: "信用卡",
    trackingNumber: null,
    timeline: [
      { date: "2026-04-04 16:00", event: "訂單建立" },
      { date: "2026-04-05 10:00", event: "付款確認" },
    ],
  },
  {
    id: "o7", orderNumber: "MOB-2026-0415", customer: "吳承恩", customerPhone: "0978-901-234",
    product: "Arne Jacobsen AJ Floor Lamp", totalTwd: 87900, status: "delivered", createdAt: "2026-03-10",
    shippingAddress: "桃園市中壢區中正路500號", paymentMethod: "銀行轉帳",
    trackingNumber: "DHL-TW-94567",
    timeline: [
      { date: "2026-03-10 09:00", event: "訂單建立" },
      { date: "2026-03-10 15:00", event: "付款確認" },
      { date: "2026-03-12 10:00", event: "已出貨" },
      { date: "2026-03-20 08:00", event: "清關完成" },
      { date: "2026-03-22 14:00", event: "已送達" },
    ],
  },
  {
    id: "o8", orderNumber: "MOB-2026-0414", customer: "鄭宇翔", customerPhone: "0989-012-345",
    product: "Barcelona Chair", totalTwd: 266400, status: "cancelled", createdAt: "2026-03-08",
    shippingAddress: "新竹市東區光復路二段101號", paymentMethod: "信用卡",
    trackingNumber: null,
    timeline: [
      { date: "2026-03-08 11:00", event: "訂單建立" },
      { date: "2026-03-10 09:00", event: "客戶取消訂單" },
    ],
  },
  {
    id: "o9", orderNumber: "MOB-2026-0413", customer: "許淑芬", customerPhone: "0910-123-456",
    product: "Poul Henningsen Artichoke Pendant", totalTwd: 356100, status: "in_transit", createdAt: "2026-03-25",
    shippingAddress: "台北市中山區南京東路三段168號", paymentMethod: "銀行轉帳",
    trackingNumber: "MAERSK-EU-44890",
    timeline: [
      { date: "2026-03-25 10:00", event: "訂單建立" },
      { date: "2026-03-25 16:00", event: "付款確認" },
      { date: "2026-03-27 09:00", event: "從丹麥出貨" },
      { date: "2026-04-01 06:00", event: "運送中" },
    ],
  },
  {
    id: "o10", orderNumber: "MOB-2026-0412", customer: "蔡明哲", customerPhone: "0921-234-567",
    product: "Isamu Noguchi Coffee Table", totalTwd: 173250, status: "delivered", createdAt: "2026-03-05",
    shippingAddress: "台北市松山區民生東路五段50號", paymentMethod: "信用卡",
    trackingNumber: "DHL-TW-93890",
    timeline: [
      { date: "2026-03-05 14:00", event: "訂單建立" },
      { date: "2026-03-05 18:00", event: "付款確認" },
      { date: "2026-03-07 10:00", event: "已出貨" },
      { date: "2026-03-15 08:00", event: "清關完成" },
      { date: "2026-03-17 15:00", event: "已送達" },
    ],
  },
];

const orderStats = {
  total: mockOrders.length,
  pending: mockOrders.filter((o) => o.status === "pending" || o.status === "confirmed").length,
  inProgress: mockOrders.filter((o) => ["shipped", "in_transit", "customs"].includes(o.status)).length,
  completed: mockOrders.filter((o) => o.status === "delivered").length,
  monthRevenue: mockOrders
    .filter((o) => o.createdAt.startsWith("2026-04") && o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalTwd, 0),
};

export default function AdminOrdersPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-charcoal">訂單管理</h1>
      <p className="mt-2 text-sm text-walnut/70">查看與管理所有訂單</p>

      {/* Stats Bar */}
      <div className="mt-6 flex flex-wrap gap-4">
        {([
          ["總訂單", orderStats.total],
          ["待處理", orderStats.pending],
          ["進行中", orderStats.inProgress],
          ["已完成", orderStats.completed],
          ["本月營收", `NT$ ${orderStats.monthRevenue.toLocaleString()}`],
        ] as const).map(([label, value]) => (
          <div key={label} className="border border-linen bg-white px-4 py-3">
            <span className="text-xs text-walnut/60">{label}</span>
            <span className="ml-2 font-serif text-lg font-bold text-charcoal">{value}</span>
          </div>
        ))}
      </div>

      {/* Order Table */}
      <div className="mt-6 overflow-hidden border border-linen bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-linen bg-cream/50">
              <tr>
                <th className="px-4 py-3 font-medium text-walnut">訂單編號</th>
                <th className="px-4 py-3 font-medium text-walnut">客戶</th>
                <th className="px-4 py-3 font-medium text-walnut">商品</th>
                <th className="px-4 py-3 font-medium text-walnut">金額(TWD)</th>
                <th className="px-4 py-3 font-medium text-walnut">狀態</th>
                <th className="px-4 py-3 font-medium text-walnut">下單日期</th>
                <th className="px-4 py-3 font-medium text-walnut">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <Fragment key={order.id}>
                  <tr
                    className="cursor-pointer border-b border-linen/50 hover:bg-cream/30"
                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  >
                    <td className="px-4 py-3 font-medium text-brass">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-charcoal">{order.customer}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-walnut/80">{order.product}</td>
                    <td className="px-4 py-3 font-medium text-charcoal">NT$ {order.totalTwd.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariants[order.status]}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-walnut/60">{order.createdAt}</td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-brass hover:underline">
                        {expandedId === order.id ? "收合" : "詳情"}
                      </button>
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr key={`${order.id}-detail`}>
                      <td colSpan={7} className="border-b border-linen bg-cream/20 px-6 py-4">
                        <div className="grid gap-6 sm:grid-cols-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-walnut/50">配送地址</p>
                            <p className="mt-1 text-sm text-charcoal">{order.shippingAddress}</p>
                            <p className="mt-1 text-sm text-walnut/60">{order.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-walnut/50">付款方式</p>
                            <p className="mt-1 text-sm text-charcoal">{order.paymentMethod}</p>
                            {order.trackingNumber && (
                              <>
                                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-walnut/50">追蹤編號</p>
                                <p className="mt-1 text-sm font-medium text-brass">{order.trackingNumber}</p>
                              </>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-walnut/50">訂單時間軸</p>
                            <div className="mt-2 space-y-2">
                              {order.timeline.map((event, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brass" />
                                  <div>
                                    <p className="text-xs text-walnut/50">{event.date}</p>
                                    <p className="text-sm text-charcoal">{event.event}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
