export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">商品管理</h1>
          <p className="mt-2 text-sm text-walnut/70">管理所有商品列表</p>
        </div>
        <button className="bg-brass px-5 py-2 text-sm font-medium text-cream transition-colors hover:bg-brass-dark">
          新增商品
        </button>
      </div>

      <div className="mt-8 overflow-hidden border border-linen bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-linen bg-cream/50">
            <tr>
              <th className="px-4 py-3 font-medium text-walnut">商品名稱</th>
              <th className="px-4 py-3 font-medium text-walnut">分類</th>
              <th className="px-4 py-3 font-medium text-walnut">價格</th>
              <th className="px-4 py-3 font-medium text-walnut">狀態</th>
              <th className="px-4 py-3 font-medium text-walnut">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-8 text-center text-walnut/50" colSpan={5}>
                暫無商品資料
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
