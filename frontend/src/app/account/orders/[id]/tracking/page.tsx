interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = await params;

  return (
    <div>
      <h2 className="font-serif text-2xl font-semibold text-charcoal">物流追蹤</h2>
      <p className="mt-2 text-sm text-walnut/70">訂單編號：{id}</p>

      <div className="mt-8 space-y-6">
        {/* Tracking timeline placeholder */}
        {[
          { status: "已下單", date: "---", active: true },
          { status: "已確認", date: "---", active: false },
          { status: "已從歐洲出貨", date: "---", active: false },
          { status: "國際運送中", date: "---", active: false },
          { status: "台灣清關中", date: "---", active: false },
          { status: "配送中", date: "---", active: false },
          { status: "已送達", date: "---", active: false },
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-4">
            <div
              className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                step.active ? "bg-brass" : "bg-linen"
              }`}
            />
            <div>
              <p className={`text-sm font-medium ${step.active ? "text-charcoal" : "text-walnut/50"}`}>
                {step.status}
              </p>
              <p className="text-xs text-walnut/40">{step.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
