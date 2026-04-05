import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface MockShipment {
  id: string;
  type: "LCL" | "FCL";
  status: string;
  itemCount: number;
  cbm: number;
  carrier: string;
  origin: string;
  eta: string;
  trackingNumber: string;
  items: string[];
}

interface ConsolidationItem {
  id: string;
  product: string;
  dealer: string;
  origin: string;
  cbm: number;
  status: string;
}

const shipmentStatusVariant: Record<string, "default" | "success" | "warning" | "info"> = {
  "裝載中": "warning",
  "運送中": "info",
  "已抵達": "success",
  "待出發": "default",
};

const mockShipments: MockShipment[] = [
  {
    id: "shp-1",
    type: "LCL",
    status: "運送中",
    itemCount: 4,
    cbm: 3.2,
    carrier: "Maersk",
    origin: "Copenhagen, Denmark",
    eta: "2026-04-18",
    trackingNumber: "MAERSK-EU-45231",
    items: ["CH24 Wishbone Chair", "PH 5 Pendant", "AJ Floor Lamp", "Model 60 Stool"],
  },
  {
    id: "shp-2",
    type: "LCL",
    status: "裝載中",
    itemCount: 3,
    cbm: 5.8,
    carrier: "Hapag-Lloyd",
    origin: "Hamburg, Germany",
    eta: "2026-04-28",
    trackingNumber: "HL-EU-78456",
    items: ["Egg Chair", "Tulip Dining Table", "String Shelf System"],
  },
  {
    id: "shp-3",
    type: "FCL",
    status: "已抵達",
    itemCount: 8,
    cbm: 18.5,
    carrier: "Evergreen",
    origin: "Rotterdam, Netherlands",
    eta: "2026-04-05",
    trackingNumber: "EVG-EU-34567",
    items: ["LC4 Chaise Longue", "Barcelona Chair", "Noguchi Coffee Table", "Artichoke Pendant", "及其他4件"],
  },
  {
    id: "shp-4",
    type: "LCL",
    status: "待出發",
    itemCount: 2,
    cbm: 1.4,
    carrier: "DHL Freight",
    origin: "Paris, France",
    eta: "2026-05-10",
    trackingNumber: "DHL-FR-89012",
    items: ["French Provincial Armoire", "Flowerpot VP1 Pendant"],
  },
];

const consolidationQueue: ConsolidationItem[] = [
  { id: "cq-1", product: "Pelican Chair", dealer: "Pamono", origin: "Germany", cbm: 1.8, status: "已收貨" },
  { id: "cq-2", product: "PP Mobler Bear Chair", dealer: "Bruun Rasmussen", origin: "Denmark", cbm: 2.1, status: "待收貨" },
  { id: "cq-3", product: "Verner Panton Heart Cone Chair", dealer: "1stDibs", origin: "Netherlands", cbm: 1.5, status: "已收貨" },
];

export default function AdminShipmentsPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-charcoal">物流管理</h1>
      <p className="mt-2 text-sm text-walnut/70">追蹤國際運送狀態</p>

      {/* Active Shipments */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {mockShipments.map((shipment) => (
          <Card key={shipment.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={shipment.type === "FCL" ? "info" : "default"}>
                    {shipment.type}
                  </Badge>
                  <Badge variant={shipmentStatusVariant[shipment.status] || "default"}>
                    {shipment.status}
                  </Badge>
                </div>
                <span className="text-xs text-walnut/50">{shipment.trackingNumber}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-walnut/50">承運商</p>
                    <p className="font-medium text-charcoal">{shipment.carrier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-walnut/50">出發地</p>
                    <p className="font-medium text-charcoal">{shipment.origin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-walnut/50">商品數量</p>
                    <p className="font-medium text-charcoal">{shipment.itemCount} 件</p>
                  </div>
                  <div>
                    <p className="text-xs text-walnut/50">體積</p>
                    <p className="font-medium text-charcoal">{shipment.cbm} CBM</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-walnut/50">預計抵達</p>
                  <p className="font-serif text-lg font-bold text-brass">{shipment.eta}</p>
                </div>

                <div>
                  <p className="mb-1 text-xs text-walnut/50">包含商品</p>
                  <div className="flex flex-wrap gap-1">
                    {shipment.items.map((item) => (
                      <span key={item} className="bg-linen/60 px-2 py-0.5 text-xs text-walnut">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Consolidation Queue */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-charcoal">併櫃等候區</h2>
            <Button variant="outline" size="sm">建立新運單</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-linen bg-cream/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-walnut">商品</th>
                  <th className="px-4 py-3 font-medium text-walnut">賣家</th>
                  <th className="px-4 py-3 font-medium text-walnut">出發國</th>
                  <th className="px-4 py-3 font-medium text-walnut">體積(CBM)</th>
                  <th className="px-4 py-3 font-medium text-walnut">狀態</th>
                </tr>
              </thead>
              <tbody>
                {consolidationQueue.map((item) => (
                  <tr key={item.id} className="border-b border-linen/50 last:border-0 hover:bg-cream/30">
                    <td className="px-4 py-3 font-medium text-charcoal">{item.product}</td>
                    <td className="px-4 py-3 text-walnut/80">{item.dealer}</td>
                    <td className="px-4 py-3 text-walnut/80">{item.origin}</td>
                    <td className="px-4 py-3 text-walnut/80">{item.cbm}</td>
                    <td className="px-4 py-3">
                      <Badge variant={item.status === "已收貨" ? "success" : "warning"}>
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
