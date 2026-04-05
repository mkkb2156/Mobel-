import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

type CustomsStatus = "pending" | "submitted" | "cleared" | "held";

interface MockCustomsEntry {
  id: string;
  declarationNumber: string;
  shipmentTrackingNumber: string;
  shipmentOrigin: string;
  status: CustomsStatus;
  cifValueTwd: number;
  dutyTwd: number;
  vatTwd: number;
  itemCount: number;
  submittedAt: string | null;
}

const statusConfig: Record<CustomsStatus, { label: string; variant: "default" | "success" | "warning" | "error" | "info" }> = {
  pending: { label: "待申報", variant: "warning" },
  submitted: { label: "已送件", variant: "info" },
  cleared: { label: "已放行", variant: "success" },
  held: { label: "扣留中", variant: "error" },
};

const mockEntries: MockCustomsEntry[] = [
  {
    id: "cus-1",
    declarationNumber: "CUS-2026-0045",
    shipmentTrackingNumber: "EVG-EU-34567",
    shipmentOrigin: "Rotterdam, Netherlands",
    status: "cleared",
    cifValueTwd: 2850000,
    dutyTwd: 142500,
    vatTwd: 149625,
    itemCount: 8,
    submittedAt: "2026-04-03",
  },
  {
    id: "cus-2",
    declarationNumber: "CUS-2026-0046",
    shipmentTrackingNumber: "MAERSK-EU-45231",
    shipmentOrigin: "Copenhagen, Denmark",
    status: "pending",
    cifValueTwd: 520000,
    dutyTwd: 26000,
    vatTwd: 27300,
    itemCount: 4,
    submittedAt: null,
  },
  {
    id: "cus-3",
    declarationNumber: "CUS-2026-0047",
    shipmentTrackingNumber: "HL-EU-78456",
    shipmentOrigin: "Hamburg, Germany",
    status: "submitted",
    cifValueTwd: 1380000,
    dutyTwd: 69000,
    vatTwd: 72450,
    itemCount: 3,
    submittedAt: "2026-04-05",
  },
  {
    id: "cus-4",
    declarationNumber: "CUS-2026-0044",
    shipmentTrackingNumber: "DHL-TW-95123",
    shipmentOrigin: "Paris, France",
    status: "held",
    cifValueTwd: 450000,
    dutyTwd: 22500,
    vatTwd: 23625,
    itemCount: 2,
    submittedAt: "2026-04-01",
  },
];

export default function AdminCustomsPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-charcoal">報關管理</h1>
      <p className="mt-2 text-sm text-walnut/70">管理台灣海關清關作業</p>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="primary">產生商業發票</Button>
        <Button variant="outline">產生裝箱單</Button>
      </div>

      {/* Declarations Table */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="font-serif text-lg font-semibold text-charcoal">報關紀錄</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-linen bg-cream/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-walnut">報關單號</th>
                  <th className="px-4 py-3 font-medium text-walnut">運單編號</th>
                  <th className="px-4 py-3 font-medium text-walnut">出發地</th>
                  <th className="px-4 py-3 font-medium text-walnut">商品數</th>
                  <th className="px-4 py-3 font-medium text-walnut">狀態</th>
                  <th className="px-4 py-3 font-medium text-walnut">CIF 價值(TWD)</th>
                  <th className="px-4 py-3 font-medium text-walnut">關稅</th>
                  <th className="px-4 py-3 font-medium text-walnut">營業稅</th>
                  <th className="px-4 py-3 font-medium text-walnut">送件日期</th>
                </tr>
              </thead>
              <tbody>
                {mockEntries.map((entry) => {
                  const sc = statusConfig[entry.status];
                  return (
                    <tr key={entry.id} className="border-b border-linen/50 last:border-0 hover:bg-cream/30">
                      <td className="px-4 py-3 font-medium text-brass">{entry.declarationNumber}</td>
                      <td className="px-4 py-3 text-walnut/80">{entry.shipmentTrackingNumber}</td>
                      <td className="px-4 py-3 text-walnut/80">{entry.shipmentOrigin}</td>
                      <td className="px-4 py-3 text-walnut/80">{entry.itemCount}</td>
                      <td className="px-4 py-3">
                        <Badge variant={sc.variant}>{sc.label}</Badge>
                      </td>
                      <td className="px-4 py-3 font-medium text-charcoal">NT$ {entry.cifValueTwd.toLocaleString()}</td>
                      <td className="px-4 py-3 text-walnut/80">NT$ {entry.dutyTwd.toLocaleString()}</td>
                      <td className="px-4 py-3 text-walnut/80">NT$ {entry.vatTwd.toLocaleString()}</td>
                      <td className="px-4 py-3 text-walnut/60">{entry.submittedAt || "--"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {([
          ["待申報", mockEntries.filter((e) => e.status === "pending").length],
          ["已送件", mockEntries.filter((e) => e.status === "submitted").length],
          ["已放行", mockEntries.filter((e) => e.status === "cleared").length],
          ["扣留中", mockEntries.filter((e) => e.status === "held").length],
        ] as const).map(([label, count]) => (
          <div key={label} className="border border-linen bg-white p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-walnut/60">{label}</p>
            <p className="mt-1 font-serif text-2xl font-bold text-charcoal">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
