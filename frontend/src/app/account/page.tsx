export default function AccountPage() {
  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-charcoal">帳戶總覽</h2>
      <p className="mt-2 text-sm text-walnut/70">管理您的個人資料與偏好設定</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="border border-linen bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-walnut">個人資料</h3>
          <p className="mt-3 text-sm text-walnut/60">姓名、電子郵件、電話號碼</p>
        </div>
        <div className="border border-linen bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-walnut">最近訂單</h3>
          <p className="mt-3 text-sm text-walnut/60">暫無訂單</p>
        </div>
        <div className="border border-linen bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-walnut">收藏清單</h3>
          <p className="mt-3 text-sm text-walnut/60">暫無收藏</p>
        </div>
        <div className="border border-linen bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-walnut">詢問記錄</h3>
          <p className="mt-3 text-sm text-walnut/60">暫無詢問</p>
        </div>
      </div>
    </div>
  );
}
