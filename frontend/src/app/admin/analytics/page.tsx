export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-charcoal">數據分析</h1>
      <p className="mt-2 text-sm text-walnut/70">檢視平台營運數據與趨勢</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="border border-linen bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-walnut/60">營收趨勢</h3>
          <div className="mt-4 flex h-48 items-center justify-center text-walnut/30">
            圖表即將推出
          </div>
        </div>
        <div className="border border-linen bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-walnut/60">訂單統計</h3>
          <div className="mt-4 flex h-48 items-center justify-center text-walnut/30">
            圖表即將推出
          </div>
        </div>
        <div className="border border-linen bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-walnut/60">熱門分類</h3>
          <div className="mt-4 flex h-48 items-center justify-center text-walnut/30">
            圖表即將推出
          </div>
        </div>
        <div className="border border-linen bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-walnut/60">流量來源</h3>
          <div className="mt-4 flex h-48 items-center justify-center text-walnut/30">
            圖表即將推出
          </div>
        </div>
      </div>
    </div>
  );
}
