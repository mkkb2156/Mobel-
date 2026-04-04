export default function AdminScraperPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">爬蟲管理</h1>
          <p className="mt-2 text-sm text-walnut/70">管理歐洲古董網站的資料爬取任務</p>
        </div>
        <button className="bg-brass px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-brass-dark">
          新增任務
        </button>
      </div>

      <div className="mt-8 overflow-hidden border border-linen bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-linen bg-cream/50">
            <tr>
              <th className="px-4 py-3 font-medium text-walnut">來源</th>
              <th className="px-4 py-3 font-medium text-walnut">狀態</th>
              <th className="px-4 py-3 font-medium text-walnut">找到項目</th>
              <th className="px-4 py-3 font-medium text-walnut">已匯入</th>
              <th className="px-4 py-3 font-medium text-walnut">時間</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-8 text-center text-walnut/50" colSpan={5}>
                暫無爬蟲任務
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
