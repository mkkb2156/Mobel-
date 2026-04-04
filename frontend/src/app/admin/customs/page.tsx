export default function AdminCustomsPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-charcoal">報關管理</h1>
      <p className="mt-2 text-sm text-walnut/70">管理台灣海關清關作業</p>

      <div className="mt-8 overflow-hidden border border-linen bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-linen bg-cream/50">
            <tr>
              <th className="px-4 py-3 font-medium text-walnut">報關單號</th>
              <th className="px-4 py-3 font-medium text-walnut">關聯訂單</th>
              <th className="px-4 py-3 font-medium text-walnut">狀態</th>
              <th className="px-4 py-3 font-medium text-walnut">關稅</th>
              <th className="px-4 py-3 font-medium text-walnut">稅金</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-8 text-center text-walnut/50" colSpan={5}>
                暫無報關記錄
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
