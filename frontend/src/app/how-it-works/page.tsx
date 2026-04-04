import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "購買流程",
};

export default function HowItWorksPage() {
  const steps = [
    { number: "01", title: "瀏覽與挑選", description: "在我們的平台上瀏覽精選的歐洲古董家具，找到您心儀的作品。" },
    { number: "02", title: "諮詢與確認", description: "對商品有任何疑問，歡迎透過詢問功能與我們聯繫。確認購買後進行付款。" },
    { number: "03", title: "國際運送", description: "我們安排專業的國際物流，確保您的家具安全從歐洲運送至台灣。" },
    { number: "04", title: "清關與配送", description: "我們協助處理台灣海關清關手續，並安排最終配送到您指定的地址。" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center font-serif text-4xl font-bold text-charcoal">購買流程</h1>
      <p className="mt-3 text-center text-walnut/70">從挑選到送達，我們為您處理每一個環節</p>

      <div className="mt-16 space-y-12">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-8">
            <span className="font-serif text-4xl font-bold text-brass/30">{step.number}</span>
            <div>
              <h2 className="font-serif text-xl font-semibold text-charcoal">{step.title}</h2>
              <p className="mt-2 leading-relaxed text-walnut/80">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
