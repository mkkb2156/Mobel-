"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Product, Dimensions } from "@/lib/types";
import { CONDITION_LABELS } from "@/lib/constants";

interface ProductTabsProps {
  product: Product;
}

type TabKey = "description" | "dimensions" | "materials" | "shipping";

const TABS: { key: TabKey; label: string }[] = [
  { key: "description", label: "商品描述" },
  { key: "dimensions", label: "尺寸規格" },
  { key: "materials", label: "材質與狀態" },
  { key: "shipping", label: "運費與關稅" },
];

function DimensionsTable({ dimensions }: { dimensions: Dimensions }) {
  // Estimate weight and volume from dimensions
  const volumeCm3 = dimensions.width * dimensions.height * dimensions.depth;
  const volumeM3 = (volumeCm3 / 1000000).toFixed(2);
  const estimatedWeightKg = Math.max(5, Math.round(volumeCm3 / 8000));

  return (
    <table className="w-full text-sm">
      <tbody className="divide-y divide-linen">
        <tr>
          <td className="py-3 text-walnut/70 w-32">寬度 (W)</td>
          <td className="py-3 text-charcoal font-medium">{dimensions.width} {dimensions.unit}</td>
        </tr>
        <tr>
          <td className="py-3 text-walnut/70">高度 (H)</td>
          <td className="py-3 text-charcoal font-medium">{dimensions.height} {dimensions.unit}</td>
        </tr>
        <tr>
          <td className="py-3 text-walnut/70">深度 (D)</td>
          <td className="py-3 text-charcoal font-medium">{dimensions.depth} {dimensions.unit}</td>
        </tr>
        <tr>
          <td className="py-3 text-walnut/70">尺寸</td>
          <td className="py-3 text-charcoal font-medium">
            {dimensions.width} x {dimensions.depth} x {dimensions.height} {dimensions.unit}
          </td>
        </tr>
        <tr>
          <td className="py-3 text-walnut/70">預估重量</td>
          <td className="py-3 text-charcoal font-medium">約 {estimatedWeightKg} kg</td>
        </tr>
        <tr>
          <td className="py-3 text-walnut/70">體積</td>
          <td className="py-3 text-charcoal font-medium">{volumeM3} m&sup3;</td>
        </tr>
      </tbody>
    </table>
  );
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  const shippingEstimate = product.price_twd > 100000 ? 25000 : 15000;

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex border-b border-linen overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "whitespace-nowrap px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px]",
              activeTab === tab.key
                ? "border-brass text-charcoal"
                : "border-transparent text-walnut/60 hover:text-walnut"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-6">
        {activeTab === "description" && (
          <div className="space-y-4">
            <p className="leading-relaxed text-walnut/80">
              {product.description_zh || "暫無中文描述。"}
            </p>
            {product.description && (
              <p className="text-sm leading-relaxed text-walnut/50 italic">
                {product.description}
              </p>
            )}
          </div>
        )}

        {activeTab === "dimensions" && (
          <div>
            {product.dimensions ? (
              <DimensionsTable dimensions={product.dimensions} />
            ) : (
              <p className="text-walnut/60">尺寸資訊暫無提供。</p>
            )}
          </div>
        )}

        {activeTab === "materials" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-charcoal mb-3">材質</h4>
              <div className="flex flex-wrap gap-2">
                {product.materials.length > 0 ? (
                  product.materials.map((mat) => (
                    <span
                      key={mat}
                      className="inline-flex items-center bg-linen px-3 py-1.5 text-sm text-walnut"
                    >
                      {mat}
                    </span>
                  ))
                ) : (
                  <p className="text-walnut/60">未提供材質資訊。</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-charcoal mb-3">狀態</h4>
              <p className="text-walnut/80">
                {CONDITION_LABELS[product.condition] || product.condition}
              </p>
              {product.condition === "excellent" && (
                <p className="mt-2 text-sm text-walnut/60">
                  狀態極佳，幾乎無使用痕跡。保留原始材料和飾面。
                </p>
              )}
              {product.condition === "good" && (
                <p className="mt-2 text-sm text-walnut/60">
                  狀態良好，有輕微使用痕跡，符合其年代特徵。結構完整穩固。
                </p>
              )}
              {product.condition === "fair" && (
                <p className="mt-2 text-sm text-walnut/60">
                  狀態尚可，有明顯的使用痕跡和歲月感。可能需要部分整理。
                </p>
              )}
              {product.condition === "restored" && (
                <p className="mt-2 text-sm text-walnut/60">
                  已由專業工匠修復。恢復了原始外觀和功能，同時保留了設計的完整性。
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-charcoal mb-3">運費預估</h4>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-linen">
                  <tr>
                    <td className="py-3 text-walnut/70">國際運費</td>
                    <td className="py-3 text-charcoal font-medium text-right">
                      NT$ {shippingEstimate.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-walnut/70">台灣境內配送</td>
                    <td className="py-3 text-charcoal font-medium text-right">
                      NT$ 2,000
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-walnut/70">保險費</td>
                    <td className="py-3 text-charcoal font-medium text-right">
                      NT$ {Math.round(product.price_twd * 0.02).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="font-medium">
                    <td className="py-3 text-charcoal">預估運費總計</td>
                    <td className="py-3 text-charcoal text-right">
                      NT$ {(shippingEstimate + 2000 + Math.round(product.price_twd * 0.02)).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h4 className="text-sm font-medium text-charcoal mb-3">關稅說明</h4>
              <ul className="space-y-2 text-sm text-walnut/70">
                <li>- 進口關稅稅率約為商品價值的 5-10%</li>
                <li>- 營業稅 (VAT) 為 5%</li>
                <li>- 實際稅額以海關核定為準</li>
                <li>- MOBEL 將協助您辦理清關手續</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-charcoal mb-3">配送時間</h4>
              <p className="text-sm text-walnut/70">
                從歐洲出發，預計 4-8 週送達台灣。包含海運、清關及國內配送時間。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
