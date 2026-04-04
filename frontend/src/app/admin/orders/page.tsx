export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-charcoal">訂單管理</h1>
      <p className="mt-2 text-sm text-walnut/70">查看與管理所有訂單</p>

      <div className="mt-8 overflow-hidden border border-linen bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-linen bg-cream/50">
            <tr>
              <th className="px-4 py-3 font-medium text-walnut">訂單編號</th>
              <th className="px-4 py-3 font-medium text-walnut">客戶</th>
              <th className="px-4 py-3 font-medium text-walnut">金額</th>
              <th className="px-4 py-3 font-medium text-walnut">狀態</th>
              <th className="px-4 py-3 font-medium text-walnut">日期</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-8 text-center text-walnut/50" colSpan={5}>
                暫無訂單資料
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
