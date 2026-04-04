import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "運費計算",
};

export default function ShippingCalculatorPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-bold text-charcoal">運費計算</h1>
      <p className="mt-3 text-walnut/70">估算您的歐洲古董家具國際運費</p>

      <div className="mt-8 border border-linen bg-white p-8">
        <p className="text-center text-walnut/60">
          運費計算器即將推出。運費依商品尺寸、重量及出發國家而異，歡迎直接聯繫我們取得報價。
        </p>
      </div>
    </div>
  );
}
