import type { Metadata } from 'next';
import { ShieldCheck, Star, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: '關於我們 - MOBEL',
};

const features = [
  {
    icon: ShieldCheck,
    title: '專業代購',
    description:
      '我們的團隊直接與歐洲各地的頂級古董商及拍賣行合作，擁有多年的鑑賞經驗與專業知識。每一件商品都經過嚴格篩選，確保真品與品質。',
  },
  {
    icon: Star,
    title: '完整保障',
    description:
      '從詢價到送達，我們提供透明的費用明細與全程追蹤。所有商品皆包含保險、品質檢驗報告，以及 7 天驗收期的售後保障。',
  },
  {
    icon: Truck,
    title: '白手套服務',
    description:
      '專業的國際物流、報關清關、最後一哩配送到定位，全由 MOBEL 一手包辦。您只需要等待家中門鈴響起，迎接來自歐洲的經典設計。',
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-charcoal px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl font-bold text-cream sm:text-5xl">
            關於 MOBEL
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-cream/70">
            MOBEL
            誕生於對歐洲設計傳承的熱愛。我們相信，每一件經典家具都承載著獨特的歷史與工藝之美，值得跨越半個地球，來到懂得欣賞它的人手中。
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
            Our Mission
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-charcoal">
            將歐洲設計傳承帶到台灣
          </h2>
        </div>
        <div className="mt-10 space-y-6 leading-relaxed text-walnut/80">
          <p>
            二十世紀的歐洲，是現代家具設計的黃金時代。從丹麥的有機極簡主義、德國包浩斯的功能美學，到義大利的前衛實驗精神——這些設計不僅定義了一個時代的美感，更成為了跨越時間的經典。
          </p>
          <p>
            MOBEL
            的使命，是搭建起歐洲古董家具與台灣收藏家之間的橋樑。我們深入歐洲各國，從哥本哈根的古董市集到米蘭的設計藏家，從巴黎的拍賣行到斯德哥爾摩的中古倉庫，為您精心挑選每一件作品。
          </p>
          <p>
            我們不僅僅是一個交易平台。我們是策展人、是守護者、是故事的傳遞者。每一件家具背後的設計理念、製作工藝、流轉歷史，都是我們想與您分享的珍貴敘事。
          </p>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="bg-linen/50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-semibold text-charcoal">
              為什麼選擇 MOBEL
            </h2>
            <p className="mt-3 text-walnut/70">
              我們對品質的堅持，體現在每一個環節
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="text-center">
                  <CardContent className="p-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center bg-brass/10">
                      <Icon className="h-7 w-7 text-brass" />
                    </div>
                    <h3 className="mt-5 font-serif text-xl font-semibold text-charcoal">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-walnut/70">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-semibold text-charcoal">
            我們的價值觀
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {[
            {
              title: '真實透明',
              text: '每一件商品的狀態、來源、費用都如實呈現。沒有隱藏費用，沒有誇大描述。',
            },
            {
              title: '永續傳承',
              text: '選擇古董家具，就是選擇永續。讓這些經得起時間考驗的設計，繼續被珍惜與使用。',
            },
            {
              title: '專業鑑賞',
              text: '團隊成員具備設計史、材料學與修復技術的專業背景，為每件商品提供專業的鑑定意見。',
            },
            {
              title: '細緻服務',
              text: '從第一通詢問到家具定位，每一步都由專人負責。您的滿意，是我們最重要的衡量標準。',
            },
          ].map((value) => (
            <div key={value.title}>
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-walnut/70">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="border-t border-linen px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-semibold text-charcoal">
            聯繫我們
          </h2>
          <p className="mt-4 text-walnut/70">
            對歐洲古董家具有任何疑問，歡迎隨時與我們聯繫
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 text-sm">
            <div>
              <p className="font-semibold text-charcoal">電子郵件</p>
              <p className="mt-1 text-brass">hello@mobel.tw</p>
            </div>
            <div>
              <p className="font-semibold text-charcoal">電話</p>
              <p className="mt-1 text-brass">02-2345-6789</p>
            </div>
            <div>
              <p className="font-semibold text-charcoal">營業時間</p>
              <p className="mt-1 text-walnut/70">週一至週五 10:00-18:00</p>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-sm text-walnut/60">
              台北市大安區敦化南路一段 233 號 8 樓
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
