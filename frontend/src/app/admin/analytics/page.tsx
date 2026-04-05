import { Card, CardContent, CardHeader } from "@/components/ui/Card";

const kpiCards = [
  { label: "本月營收", value: "NT$ 4,230,000", change: "+22%", positive: true },
  { label: "本月訂單", value: "67", change: "+15%", positive: true },
  { label: "平均訂單金額", value: "NT$ 63,134", change: "+5%", positive: true },
  { label: "毛利率", value: "32.4%", change: "-1.2%", positive: false },
];

const topCategories = [
  { category: "座椅 Seating", orders: 28, revenue: "NT$ 1,890,000" },
  { category: "燈具 Lighting", orders: 18, revenue: "NT$ 980,000" },
  { category: "桌几 Tables", orders: 11, revenue: "NT$ 720,000" },
  { category: "收納 Storage", orders: 6, revenue: "NT$ 380,000" },
  { category: "裝飾 Decor", orders: 4, revenue: "NT$ 260,000" },
];

const topProducts = [
  { name: "Hans Wegner CH24 Wishbone Chair", views: 1240, inquiries: 45, orders: 8 },
  { name: "Arne Jacobsen Egg Chair", views: 980, inquiries: 32, orders: 5 },
  { name: "Poul Henningsen PH 5 Pendant", views: 870, inquiries: 28, orders: 7 },
  { name: "Eero Saarinen Tulip Table", views: 650, inquiries: 18, orders: 4 },
  { name: "Finn Juhl Pelican Chair", views: 520, inquiries: 15, orders: 3 },
];

const funnelSteps = [
  { label: "瀏覽", value: 12450, percentage: 100 },
  { label: "詢價", value: 834, percentage: 6.7 },
  { label: "下單", value: 127, percentage: 1.02 },
  { label: "完成", value: 98, percentage: 0.79 },
];

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-charcoal">數據分析</h1>
      <p className="mt-2 text-sm text-walnut/70">檢視平台營運數據與趨勢</p>

      {/* KPI Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="border border-linen bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-walnut/60">{kpi.label}</p>
            <p className="mt-2 font-serif text-2xl font-bold text-charcoal">{kpi.value}</p>
            <p className={`mt-1 text-xs font-medium ${kpi.positive ? "text-green-600" : "text-red-600"}`}>
              {kpi.change} 較上月
            </p>
          </div>
        ))}
      </div>

      {/* Revenue Chart Placeholder */}
      <Card className="mt-8">
        <CardHeader>
          <h2 className="font-serif text-lg font-semibold text-charcoal">營收趨勢</h2>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded border border-dashed border-linen">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-walnut/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="mt-2 text-sm text-walnut/40">月營收趨勢圖表</p>
              <p className="mt-1 text-xs text-walnut/30">整合圖表庫後即可顯示</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <h2 className="font-serif text-lg font-semibold text-charcoal">熱門分類</h2>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-linen bg-cream/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-walnut">分類</th>
                  <th className="px-4 py-3 font-medium text-walnut">訂單數</th>
                  <th className="px-4 py-3 font-medium text-walnut">營收</th>
                </tr>
              </thead>
              <tbody>
                {topCategories.map((cat) => (
                  <tr key={cat.category} className="border-b border-linen/50 last:border-0">
                    <td className="px-4 py-3 font-medium text-charcoal">{cat.category}</td>
                    <td className="px-4 py-3 text-walnut/80">{cat.orders}</td>
                    <td className="px-4 py-3 font-medium text-charcoal">{cat.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <h2 className="font-serif text-lg font-semibold text-charcoal">熱門商品</h2>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-linen bg-cream/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-walnut">商品</th>
                  <th className="px-4 py-3 font-medium text-walnut">瀏覽</th>
                  <th className="px-4 py-3 font-medium text-walnut">詢價</th>
                  <th className="px-4 py-3 font-medium text-walnut">訂單</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((prod) => (
                  <tr key={prod.name} className="border-b border-linen/50 last:border-0">
                    <td className="max-w-[180px] truncate px-4 py-3 font-medium text-charcoal">{prod.name}</td>
                    <td className="px-4 py-3 text-walnut/80">{prod.views.toLocaleString()}</td>
                    <td className="px-4 py-3 text-walnut/80">{prod.inquiries}</td>
                    <td className="px-4 py-3 font-medium text-charcoal">{prod.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="font-serif text-lg font-semibold text-charcoal">轉換漏斗</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            {funnelSteps.map((step, idx) => {
              const heightPercent = Math.max(15, (step.value / funnelSteps[0].value) * 100);
              return (
                <div key={step.label} className="flex flex-1 flex-col items-center">
                  <p className="mb-1 text-sm font-bold text-charcoal">{step.value.toLocaleString()}</p>
                  <p className="mb-2 text-xs text-walnut/50">{step.percentage}%</p>
                  <div
                    className="w-full rounded-t bg-brass/70 transition-all"
                    style={{ height: `${heightPercent * 1.6}px` }}
                  />
                  <p className="mt-2 text-sm font-medium text-walnut">{step.label}</p>
                  {idx < funnelSteps.length - 1 && (
                    <p className="mt-0.5 text-xs text-walnut/40">
                      {((funnelSteps[idx + 1].value / step.value) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution Placeholder */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="font-serif text-lg font-semibold text-charcoal">客戶地理分佈</h2>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center rounded border border-dashed border-linen">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-walnut/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-sm text-walnut/40">客戶地理分佈圖</p>
              <p className="mt-1 text-xs text-walnut/30">整合地圖庫後即可顯示</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
