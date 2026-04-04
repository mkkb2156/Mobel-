export default function AdminDashboardPage() {
  const stats = [
    { label: "商品總數", value: "---" },
    { label: "待審核", value: "---" },
    { label: "本月訂單", value: "---" },
    { label: "本月營收", value: "NT$ ---" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-charcoal">管理總覽</h1>
      <p className="mt-2 text-sm text-walnut/70">MOBEL 後台管理系統</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-linen bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-walnut/60">
              {stat.label}
            </p>
            <p className="mt-2 font-serif text-2xl font-bold text-charcoal">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
