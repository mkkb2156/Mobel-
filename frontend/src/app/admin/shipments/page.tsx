export default function AdminShipmentsPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-charcoal">物流管理</h1>
      <p className="mt-2 text-sm text-walnut/70">追蹤國際運送狀態</p>

      <div className="mt-8 overflow-hidden border border-linen bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-linen bg-cream/50">
            <tr>
              <th className="px-4 py-3 font-medium text-walnut">追蹤編號</th>
              <th className="px-4 py-3 font-medium text-walnut">承運商</th>
              <th className="px-4 py-3 font-medium text-walnut">出發國</th>
              <th className="px-4 py-3 font-medium text-walnut">狀態</th>
              <th className="px-4 py-3 font-medium text-walnut">預計抵達</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-8 text-center text-walnut/50" colSpan={5}>
                暫無物流記錄
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
