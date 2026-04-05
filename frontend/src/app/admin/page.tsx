import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const stats = [
  { label: "商品總數", value: "1,247", change: "+23", changeType: "up" as const },
  { label: "上架中", value: "892", change: "+12", changeType: "up" as const },
  { label: "待審核", value: "34", change: "+8", changeType: "warning" as const },
  { label: "本月訂單", value: "67", change: "+15%", changeType: "up" as const },
  { label: "本月營收", value: "NT$ 4,230,000", change: "+22%", changeType: "up" as const },
];

const recentActivity = [
  { id: 1, type: "scraper", message: "爬蟲完成：Pamono 新增 47 件商品", time: "12 分鐘前" },
  { id: 2, type: "order", message: "新訂單 MOB-2026-0421：Hans Wegner CH24 Wishbone Chair", time: "35 分鐘前" },
  { id: 3, type: "inquiry", message: "新詢問：客戶詢問 Arne Jacobsen Egg Chair 運送時間", time: "1 小時前" },
  { id: 4, type: "scraper", message: "價格更新：更新 128 件商品的歐元報價", time: "2 小時前" },
  { id: 5, type: "order", message: "訂單 MOB-2026-0420 已出貨：追蹤編號 DHL-TW-98234", time: "2 小時前" },
  { id: 6, type: "inquiry", message: "新詢問：客戶詢問 Finn Juhl Pelican Chair 狀況", time: "3 小時前" },
  { id: 7, type: "scraper", message: "爬蟲完成：1stDibs 增量更新 23 件", time: "4 小時前" },
  { id: 8, type: "order", message: "訂單 MOB-2026-0419 清關完成，準備配送", time: "5 小時前" },
  { id: 9, type: "scraper", message: "可用性檢查：下架 5 件已售出商品", time: "6 小時前" },
  { id: 10, type: "order", message: "新訂單 MOB-2026-0418：Poul Henningsen PH5 吊燈", time: "昨天" },
];

const activityTypeStyles: Record<string, { dot: string; label: string }> = {
  scraper: { dot: "bg-blue-400", label: "爬蟲" },
  order: { dot: "bg-green-500", label: "訂單" },
  inquiry: { dot: "bg-amber-500", label: "詢問" },
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-charcoal">管理總覽</h1>
      <p className="mt-2 text-sm text-walnut/70">MOBEL 後台管理系統</p>

      {/* Stats Row */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-linen bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-walnut/60">
              {stat.label}
            </p>
            <p className="mt-2 font-serif text-2xl font-bold text-charcoal">{stat.value}</p>
            <p
              className={`mt-1 text-xs font-medium ${
                stat.changeType === "up"
                  ? "text-green-600"
                  : stat.changeType === "warning"
                    ? "text-amber-600"
                    : "text-walnut/50"
              }`}
            >
              {stat.change} 較上月
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="font-serif text-lg font-semibold text-charcoal">近期活動</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((item) => {
                  const style = activityTypeStyles[item.type];
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 border-b border-linen/60 pb-3 last:border-0 last:pb-0"
                    >
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-charcoal">{item.message}</p>
                        <p className="mt-0.5 text-xs text-walnut/50">{item.time}</p>
                      </div>
                      <Badge className="shrink-0">{style.label}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions + System Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-serif text-lg font-semibold text-charcoal">快速操作</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="primary" className="w-full justify-start">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  執行爬蟲
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  審核佇列 (34)
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  匯出報表
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-serif text-lg font-semibold text-charcoal">系統狀態</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-charcoal">爬蟲服務</span>
                  </div>
                  <span className="text-xs text-walnut/60">上次執行: 2h ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-charcoal">匯率服務</span>
                  </div>
                  <span className="text-xs text-walnut/60">EUR/TWD 34.5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-sm text-charcoal">待處理詢問</span>
                  </div>
                  <span className="text-xs font-medium text-amber-600">7 件</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="border border-linen bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-walnut/60">
            營收趨勢
          </h3>
          <div className="mt-4 flex h-48 items-center justify-center rounded border border-dashed border-linen">
            <div className="text-center">
              <svg className="mx-auto h-10 w-10 text-walnut/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="mt-2 text-sm text-walnut/40">營收趨勢圖表</p>
            </div>
          </div>
        </div>
        <div className="border border-linen bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-walnut/60">
            商品分類分佈
          </h3>
          <div className="mt-4 flex h-48 items-center justify-center rounded border border-dashed border-linen">
            <div className="text-center">
              <svg className="mx-auto h-10 w-10 text-walnut/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              <p className="mt-2 text-sm text-walnut/40">商品分類分佈圖表</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
