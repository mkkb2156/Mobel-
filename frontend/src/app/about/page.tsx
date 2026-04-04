import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "關於我們",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-bold text-charcoal">關於 MOBEL</h1>
      <div className="mt-8 space-y-6 leading-relaxed text-walnut/80">
        <p>
          MOBEL 致力於將歐洲最精緻的古董家具帶到台灣。我們相信，每一件經典家具都承載著獨特的歷史與工藝之美，值得被珍藏與傳承。
        </p>
        <p>
          我們的團隊直接與歐洲各地的古董商及拍賣行合作，精心挑選每一件作品。從北歐的中世紀現代設計到法國的裝飾藝術風格，我們為您呈現最多元的選擇。
        </p>
        <p>
          從挑選、檢驗、國際運輸到台灣清關，我們提供完整的一站式服務，讓您安心享受來自歐洲的經典之美。
        </p>
      </div>
    </div>
  );
}
