import type { Metadata } from 'next';
import {
  Search,
  Calculator,
  CreditCard,
  Handshake,
  CheckCircle,
  Ship,
  Truck,
  Star,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '購買流程 - MOBEL',
};

const steps = [
  {
    number: '01',
    icon: Search,
    title: '瀏覽選購',
    description:
      '在 MOBEL 平台上瀏覽來自歐洲各地的精選古董家具。每件商品都附有詳細的狀態描述、尺寸資訊、設計師背景，以及來源證明。您可以依據設計師、風格、年代等條件篩選，找到最符合您空間風格的經典作品。',
  },
  {
    number: '02',
    icon: Calculator,
    title: '詢價確認',
    description:
      '對心儀的商品提出詢問，我們會確認歐洲經銷商的庫存與可用性，並提供完整的費用明細——包含商品價格、國際運費、關稅預估、保險費用等，讓您清楚掌握所有成本，做出最好的決定。',
  },
  {
    number: '03',
    icon: CreditCard,
    title: '下單付款',
    description:
      '確認購買後，您可以選擇信用卡、銀行轉帳或分期付款等方式完成付款。我們提供安全的線上支付環境，您的交易資料都經過加密保護。',
  },
  {
    number: '04',
    icon: Handshake,
    title: '代購執行',
    description:
      '付款確認後，MOBEL 團隊會代替您向歐洲經銷商下單。我們與歐洲各國數十家優質古董商保持長期合作關係，確保每一筆交易的順暢與安全。',
  },
  {
    number: '05',
    icon: CheckCircle,
    title: '品質檢驗',
    description:
      '商品送達歐洲倉庫後，我們的專業團隊會進行全面的品質檢驗，包括外觀狀態、結構穩固性、材質確認等。檢驗完成後，會將詳細的實物照片寄送給您確認。',
  },
  {
    number: '06',
    icon: Ship,
    title: '國際運輸',
    description:
      '通過檢驗的商品會以專業的包裝方式進行海運出貨。我們使用高品質的防震包材，確保家具在長途運輸中不受損傷。全程提供即時追蹤，讓您隨時掌握運送進度。',
  },
  {
    number: '07',
    icon: Truck,
    title: '清關配送',
    description:
      '商品抵達台灣後，我們協助處理所有海關清關手續，包括報關、繳稅等作業。清關完成後，由專業的白手套配送團隊將家具安全送達您指定的地址，並負責定位擺放。',
  },
  {
    number: '08',
    icon: Star,
    title: '驗收完成',
    description:
      '家具送達後，您享有 7 天的驗收期間。在此期間如發現任何與描述不符之處，我們將全力協助處理。滿意驗收後，這件承載著歐洲設計靈魂的經典家具，就正式成為您空間中的一部分。',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-serif text-4xl font-bold text-charcoal">
          購買流程
        </h1>
        <p className="mt-4 text-lg text-walnut/70 max-w-2xl mx-auto leading-relaxed">
          從挑選到送達，MOBEL 為您處理每一個環節。
          <br />
          八個步驟，將歐洲經典設計帶入您的生活空間。
        </p>
      </div>

      {/* Steps */}
      <div className="mt-20 space-y-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="relative flex gap-8">
              {/* Timeline Column */}
              <div className="flex flex-col items-center">
                {/* Number Circle */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-brass bg-cream">
                  <span className="font-serif text-xl font-bold text-brass">
                    {step.number}
                  </span>
                </div>
                {/* Connecting Line */}
                {!isLast && <div className="w-px flex-1 bg-brass/20 min-h-[2rem]" />}
              </div>

              {/* Content */}
              <div className="pb-12 pt-1">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-brass" />
                  <h2 className="font-serif text-xl font-semibold text-charcoal">
                    {step.title}
                  </h2>
                </div>
                <p className="mt-3 leading-relaxed text-walnut/80 max-w-xl">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center border-t border-linen pt-12">
        <p className="text-lg text-walnut/70">
          準備好開始您的歐洲古董家具之旅了嗎？
        </p>
        <a
          href="/products"
          className="mt-6 inline-block bg-brass px-8 py-3 text-sm font-medium tracking-wide text-cream transition-colors hover:bg-brass-dark"
        >
          開始瀏覽
        </a>
      </div>
    </div>
  );
}
