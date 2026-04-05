"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

type FilterTab = "all" | "low_confidence" | "missing_translation" | "missing_price" | "missing_dimensions";
type QualityGrade = "A" | "B" | "C";

interface ReviewItem {
  id: string;
  imageUrl: string;
  originalTitle: string;
  titleZh: string;
  category: string;
  confidence: number;
  qualityGrade: QualityGrade;
  designer: string;
  priceEur: number;
  priceTwd: number;
  dimensions: string | null;
  materials: string[];
  reviewReason: string;
  filterTags: FilterTab[];
}

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "low_confidence", label: "低信心度" },
  { key: "missing_translation", label: "缺少翻譯" },
  { key: "missing_price", label: "缺少價格" },
  { key: "missing_dimensions", label: "缺少尺寸" },
];

const gradeStyles: Record<QualityGrade, string> = {
  A: "bg-green-50 text-green-700",
  B: "bg-amber-50 text-amber-700",
  C: "bg-red-50 text-red-700",
};

const mockReviewItems: ReviewItem[] = [
  {
    id: "rev-1",
    imageUrl: "/images/placeholder-product.jpg",
    originalTitle: "Hans Wegner CH24 Wishbone Chair, Carl Hansen & Son, 1950s",
    titleZh: "Hans Wegner CH24 Y椅 - Carl Hansen & Son 1950年代",
    category: "座椅 Seating",
    confidence: 0.94,
    qualityGrade: "A",
    designer: "Hans J. Wegner",
    priceEur: 2800,
    priceTwd: 96600,
    dimensions: "55W x 51D x 76H cm",
    materials: ["橡木", "紙繩"],
    reviewReason: "自動核准候選 - 高信心度匹配",
    filterTags: ["all"],
  },
  {
    id: "rev-2",
    imageUrl: "/images/placeholder-product.jpg",
    originalTitle: "Alvar Aalto Model 60 Stacking Stool, Artek",
    titleZh: "Alvar Aalto 60號堆疊凳 - Artek",
    category: "座椅 Seating",
    confidence: 0.72,
    qualityGrade: "B",
    designer: "Alvar Aalto",
    priceEur: 450,
    priceTwd: 15525,
    dimensions: "38W x 38D x 44H cm",
    materials: ["樺木"],
    reviewReason: "分類信心度中等 - 建議人工確認分類是否為座椅或桌几",
    filterTags: ["all", "low_confidence"],
  },
  {
    id: "rev-3",
    imageUrl: "/images/placeholder-product.jpg",
    originalTitle: "Brass and Glass Side Table, Italian, 1970s",
    titleZh: "",
    category: "桌几 Tables",
    confidence: 0.65,
    qualityGrade: "B",
    designer: "Unknown",
    priceEur: 1200,
    priceTwd: 41400,
    dimensions: null,
    materials: ["黃銅", "玻璃"],
    reviewReason: "缺少中文翻譯 / 缺少尺寸資料 / 設計師不明",
    filterTags: ["all", "missing_translation", "missing_dimensions"],
  },
  {
    id: "rev-4",
    imageUrl: "/images/placeholder-product.jpg",
    originalTitle: "Poul Henningsen PH 5 Pendant, Louis Poulsen, Denmark",
    titleZh: "Poul Henningsen PH 5 吊燈 - Louis Poulsen 丹麥",
    category: "燈具 Lighting",
    confidence: 0.88,
    qualityGrade: "A",
    designer: "Poul Henningsen",
    priceEur: 0,
    priceTwd: 0,
    dimensions: "50W x 50D x 27H cm",
    materials: ["鋁", "鋼"],
    reviewReason: "缺少歐元定價 - 需要手動輸入價格",
    filterTags: ["all", "missing_price"],
  },
  {
    id: "rev-5",
    imageUrl: "/images/placeholder-product.jpg",
    originalTitle: "Vintage French Provincial Armoire, Oak, circa 1890",
    titleZh: "法式鄉村橡木衣櫃 約1890年",
    category: "收納 Storage",
    confidence: 0.45,
    qualityGrade: "C",
    designer: "Unknown",
    priceEur: 3500,
    priceTwd: 120750,
    dimensions: "140W x 58D x 220H cm",
    materials: ["橡木"],
    reviewReason: "AI 分類信心度極低 - 可能為收納或裝飾類別，需人工判斷",
    filterTags: ["all", "low_confidence"],
  },
];

export default function AdminReviewPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filtered = activeTab === "all"
    ? mockReviewItems
    : mockReviewItems.filter((item) => item.filterTags.includes(activeTab));

  const pendingCount = mockReviewItems.length;

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-charcoal">審核中心</h1>
      <p className="mt-2 text-sm text-walnut/70">審核待上架的商品資訊與翻譯</p>

      {/* Queue Stats Bar */}
      <div className="mt-6 flex flex-wrap items-center gap-6 border border-linen bg-white p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-walnut/60">待審核項目:</span>
          <span className="font-serif text-lg font-bold text-charcoal">{pendingCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-walnut/60">平均處理時間:</span>
          <span className="font-serif text-lg font-bold text-charcoal">2.3 分鐘</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-4 flex flex-wrap gap-1 border-b border-linen">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-brass text-brass"
                : "text-walnut/60 hover:text-charcoal"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review Cards */}
      <div className="mt-6 space-y-4">
        {filtered.map((item) => {
          const confidenceColor =
            item.confidence > 0.8
              ? "bg-green-500"
              : item.confidence > 0.6
                ? "bg-amber-500"
                : "bg-red-500";
          const confidenceTextColor =
            item.confidence > 0.8
              ? "text-green-700"
              : item.confidence > 0.6
                ? "text-amber-700"
                : "text-red-700";

          return (
            <Card key={item.id}>
              <CardContent className="p-0">
                <div className="flex flex-col gap-5 p-5 lg:flex-row">
                  {/* Image */}
                  <div className="flex h-40 w-full shrink-0 items-center justify-center bg-linen/50 lg:h-auto lg:w-44">
                    <svg className="h-12 w-12 text-walnut/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Original Info */}
                  <div className="min-w-0 flex-1 space-y-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-walnut/50">原始標題</p>
                      <p className="mt-1 text-sm text-charcoal">{item.originalTitle}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-walnut/50">中文標題</p>
                      <p className="mt-1 text-sm text-charcoal">
                        {item.titleZh || <span className="italic text-red-400">缺少翻譯</span>}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-walnut/50">設計師: </span>
                        <span className="text-charcoal">{item.designer}</span>
                      </div>
                      <div>
                        <span className="text-walnut/50">材質: </span>
                        <span className="text-charcoal">{item.materials.join(", ")}</span>
                      </div>
                      <div>
                        <span className="text-walnut/50">尺寸: </span>
                        <span className="text-charcoal">
                          {item.dimensions || <span className="italic text-red-400">缺少</span>}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Processed Info */}
                  <div className="w-full shrink-0 space-y-3 border-t border-linen pt-4 lg:w-64 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-walnut/50">AI 分類</span>
                      <Badge>{item.category}</Badge>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-walnut/50">信心度</span>
                        <span className={`text-sm font-bold ${confidenceTextColor}`}>
                          {(item.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-linen">
                        <div
                          className={`h-full rounded-full ${confidenceColor}`}
                          style={{ width: `${item.confidence * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-walnut/50">品質等級</span>
                      <span className={`inline-flex h-7 w-7 items-center justify-center text-sm font-bold ${gradeStyles[item.qualityGrade]}`}>
                        {item.qualityGrade}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-walnut/50">建議售價</span>
                      <p className="mt-1 font-serif text-lg font-bold text-charcoal">
                        {item.priceTwd > 0 ? `NT$ ${item.priceTwd.toLocaleString()}` : <span className="text-red-400">未定價</span>}
                      </p>
                      {item.priceEur > 0 && (
                        <p className="text-xs text-walnut/50">
                          EUR {item.priceEur.toLocaleString()} x 34.5
                        </p>
                      )}
                    </div>

                    <div className="rounded bg-cream/80 p-2">
                      <p className="text-xs text-walnut/70">{item.reviewReason}</p>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button variant="primary" size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        核准上架
                      </Button>
                      <Button variant="danger" size="sm" className="flex-1">
                        退回修改
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      手動編輯
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
