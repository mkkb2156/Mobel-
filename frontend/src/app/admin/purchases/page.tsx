"use client";

import { useState, Fragment } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type PurchaseStatus = "pending" | "confirmed" | "paid" | "shipped" | "received";

interface MockPurchase {
  id: string;
  orderId: string;
  dealer: string;
  dealerCountry: string;
  product: string;
  costEur: number;
  paymentMethod: string;
  status: PurchaseStatus;
  createdAt: string;
}

const statusFlow: PurchaseStatus[] = ["pending", "confirmed", "paid", "shipped", "received"];

const statusLabels: Record<PurchaseStatus, string> = {
  pending: "等待回覆",
  confirmed: "已確認",
  paid: "已付款",
  shipped: "已寄出",
  received: "已收貨",
};

const statusVariants: Record<PurchaseStatus, "default" | "success" | "warning" | "error" | "info"> = {
  pending: "warning",
  confirmed: "info",
  paid: "info",
  shipped: "info",
  received: "success",
};

const mockPurchases: MockPurchase[] = [
  { id: "pur-1", orderId: "MOB-2026-0421", dealer: "Bruun Rasmussen", dealerCountry: "Denmark", product: "Hans Wegner CH24 Wishbone Chair", costEur: 2800, paymentMethod: "Wire Transfer", status: "pending", createdAt: "2026-04-05" },
  { id: "pur-2", orderId: "MOB-2026-0420", dealer: "Pamono", dealerCountry: "Germany", product: "Arne Jacobsen Egg Chair", costEur: 12500, paymentMethod: "Wire Transfer", status: "shipped", createdAt: "2026-04-03" },
  { id: "pur-3", orderId: "MOB-2026-0419", dealer: "1stDibs - Nordic Light", dealerCountry: "Denmark", product: "Poul Henningsen PH 5 Pendant", costEur: 1800, paymentMethod: "PayPal", status: "paid", createdAt: "2026-04-01" },
  { id: "pur-4", orderId: "MOB-2026-0418", dealer: "Vinterior", dealerCountry: "UK", product: "Eero Saarinen Tulip Dining Table", costEur: 5800, paymentMethod: "Wire Transfer", status: "shipped", createdAt: "2026-03-28" },
  { id: "pur-5", orderId: "MOB-2026-0416", dealer: "Pamono", dealerCountry: "Germany", product: "Finn Juhl Pelican Chair", costEur: 15200, paymentMethod: "Wire Transfer", status: "confirmed", createdAt: "2026-04-04" },
  { id: "pur-6", orderId: "MOB-2026-0413", dealer: "Lauritz.com", dealerCountry: "Denmark", product: "Poul Henningsen Artichoke Pendant", costEur: 9800, paymentMethod: "Wire Transfer", status: "received", createdAt: "2026-03-25" },
  { id: "pur-7", orderId: "MOB-2026-0417", dealer: "1stDibs - Morentz", dealerCountry: "Netherlands", product: "Le Corbusier LC4 Chaise Longue", costEur: 8900, paymentMethod: "Wire Transfer", status: "received", createdAt: "2026-03-15" },
  { id: "pur-8", orderId: "MOB-2026-0412", dealer: "Design Market", dealerCountry: "France", product: "Isamu Noguchi Coffee Table", costEur: 4500, paymentMethod: "PayPal", status: "received", createdAt: "2026-03-05" },
];

const purchaseStats = {
  active: mockPurchases.filter((p) => !["received"].includes(p.status)).length,
  awaitingResponse: mockPurchases.filter((p) => p.status === "pending").length,
  paymentPending: mockPurchases.filter((p) => p.status === "confirmed").length,
  atWarehouse: mockPurchases.filter((p) => p.status === "received").length,
};

export default function AdminPurchasesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-charcoal">採購管理</h1>
      <p className="mt-2 text-sm text-walnut/70">管理歐洲古董商採購單</p>

      {/* Stats Bar */}
      <div className="mt-6 flex flex-wrap gap-4">
        {([
          ["進行中採購", purchaseStats.active],
          ["等待回覆", purchaseStats.awaitingResponse],
          ["待付款", purchaseStats.paymentPending],
          ["已入倉", purchaseStats.atWarehouse],
        ] as const).map(([label, value]) => (
          <div key={label} className="border border-linen bg-white px-4 py-3">
            <span className="text-xs text-walnut/60">{label}</span>
            <span className="ml-2 font-serif text-lg font-bold text-charcoal">{value}</span>
          </div>
        ))}
      </div>

      {/* Purchase Table */}
      <div className="mt-6 overflow-hidden border border-linen bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-linen bg-cream/50">
              <tr>
                <th className="px-4 py-3 font-medium text-walnut">訂單</th>
                <th className="px-4 py-3 font-medium text-walnut">賣家</th>
                <th className="px-4 py-3 font-medium text-walnut">商品</th>
                <th className="px-4 py-3 font-medium text-walnut">金額(EUR)</th>
                <th className="px-4 py-3 font-medium text-walnut">付款方式</th>
                <th className="px-4 py-3 font-medium text-walnut">狀態</th>
                <th className="px-4 py-3 font-medium text-walnut">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockPurchases.map((purchase) => (
                <Fragment key={purchase.id}>
                  <tr
                    className="cursor-pointer border-b border-linen/50 hover:bg-cream/30"
                    onClick={() => setExpandedId(expandedId === purchase.id ? null : purchase.id)}
                  >
                    <td className="px-4 py-3 font-medium text-brass">{purchase.orderId}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-charcoal">{purchase.dealer}</p>
                        <p className="text-xs text-walnut/50">{purchase.dealerCountry}</p>
                      </div>
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-walnut/80">{purchase.product}</td>
                    <td className="px-4 py-3 font-medium text-charcoal">&euro; {purchase.costEur.toLocaleString()}</td>
                    <td className="px-4 py-3 text-walnut/60">{purchase.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariants[purchase.status]}>
                        {statusLabels[purchase.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">
                        {expandedId === purchase.id ? "收合" : "詳情"}
                      </Button>
                    </td>
                  </tr>
                  {expandedId === purchase.id && (
                    <tr key={`${purchase.id}-detail`}>
                      <td colSpan={7} className="border-b border-linen bg-cream/20 px-6 py-5">
                        {/* Status Flow */}
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-walnut/50">採購進度</p>
                        <div className="flex items-center gap-1">
                          {statusFlow.map((step, idx) => {
                            const currentIdx = statusFlow.indexOf(purchase.status);
                            const isCompleted = idx <= currentIdx;
                            const isCurrent = idx === currentIdx;
                            return (
                              <div key={step} className="flex flex-1 items-center">
                                <div className="flex flex-1 flex-col items-center">
                                  <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                      isCurrent
                                        ? "bg-brass text-cream"
                                        : isCompleted
                                          ? "bg-green-500 text-white"
                                          : "bg-linen text-walnut/40"
                                    }`}
                                  >
                                    {isCompleted && !isCurrent ? (
                                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : (
                                      idx + 1
                                    )}
                                  </div>
                                  <span className={`mt-1 text-xs ${isCurrent ? "font-medium text-brass" : "text-walnut/50"}`}>
                                    {statusLabels[step]}
                                  </span>
                                </div>
                                {idx < statusFlow.length - 1 && (
                                  <div
                                    className={`mx-1 h-0.5 flex-1 ${
                                      idx < currentIdx ? "bg-green-500" : "bg-linen"
                                    }`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-4 flex gap-2">
                          {purchase.status === "pending" && (
                            <Button variant="primary" size="sm">標記為已確認</Button>
                          )}
                          {purchase.status === "confirmed" && (
                            <Button variant="primary" size="sm">標記為已付款</Button>
                          )}
                          {purchase.status === "paid" && (
                            <Button variant="primary" size="sm">標記為已寄出</Button>
                          )}
                          {purchase.status === "shipped" && (
                            <Button variant="primary" size="sm">標記為已收貨</Button>
                          )}
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
