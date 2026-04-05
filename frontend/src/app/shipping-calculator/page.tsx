'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Calculator, Info } from 'lucide-react';

const CATEGORY_AVERAGES: Record<
  string,
  { label: string; length: number; width: number; height: number; weight: number }
> = {
  armchair: { label: '扶手椅', length: 80, width: 75, height: 90, weight: 25 },
  sofa_2seat: { label: '雙人沙發', length: 160, width: 85, height: 85, weight: 55 },
  sofa_3seat: { label: '三人沙發', length: 220, width: 90, height: 85, weight: 75 },
  dining_table: { label: '餐桌', length: 180, width: 90, height: 75, weight: 60 },
  coffee_table: { label: '茶几', length: 120, width: 60, height: 45, weight: 25 },
  desk: { label: '書桌', length: 140, width: 70, height: 75, weight: 45 },
  bookshelf: { label: '書櫃', length: 100, width: 40, height: 200, weight: 70 },
  sideboard: { label: '餐邊櫃', length: 180, width: 45, height: 80, weight: 55 },
  wardrobe: { label: '衣櫃', length: 120, width: 60, height: 200, weight: 90 },
  dining_chair: { label: '餐椅', length: 50, width: 50, height: 80, weight: 8 },
  pendant_light: { label: '吊燈', length: 60, width: 60, height: 40, weight: 5 },
  floor_lamp: { label: '立燈', length: 40, width: 40, height: 170, weight: 8 },
};

const TAIWAN_CITIES = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
  '基隆市', '新竹市', '嘉義市', '新竹縣', '苗栗縣', '彰化縣',
  '南投縣', '雲林縣', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
  '台東縣', '澎湖縣', '金門縣', '連江縣',
];

// Shipping rates (simplified estimates)
const BASE_SEA_FREIGHT_PER_CBM = 12000; // TWD per CBM for LCL
const FCL_20FT_RATE = 85000; // TWD for 20ft container
const DUTY_RATE = 0.065; // 6.5% for furniture
const VAT_RATE = 0.05; // 5% business tax
const INSURANCE_RATE = 0.015; // 1.5% of goods value

export default function ShippingCalculatorPage() {
  const [category, setCategory] = useState('');
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    weight: '',
  });
  const [city, setCity] = useState('台北市');
  const [shippingMethod, setShippingMethod] = useState<'lcl' | 'fcl'>('lcl');
  const [goodsValue, setGoodsValue] = useState('100000');

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    if (cat && CATEGORY_AVERAGES[cat]) {
      const avg = CATEGORY_AVERAGES[cat];
      setDimensions({
        length: String(avg.length),
        width: String(avg.width),
        height: String(avg.height),
        weight: String(avg.weight),
      });
    }
  };

  const result = useMemo(() => {
    const l = parseFloat(dimensions.length) || 0;
    const w = parseFloat(dimensions.width) || 0;
    const h = parseFloat(dimensions.height) || 0;
    const weight = parseFloat(dimensions.weight) || 0;
    const value = parseFloat(goodsValue) || 0;

    if (l === 0 || w === 0 || h === 0) return null;

    // Calculate CBM
    const cbm = (l * w * h) / 1000000;

    // Shipping cost
    const shippingCost =
      shippingMethod === 'lcl'
        ? Math.max(cbm * BASE_SEA_FREIGHT_PER_CBM, 8000) // minimum charge
        : FCL_20FT_RATE;

    // CIF value (Cost + Insurance + Freight)
    const insuranceCost = value * INSURANCE_RATE;
    const cifValue = value + shippingCost + insuranceCost;

    // Duties and taxes
    const dutyCost = cifValue * DUTY_RATE;
    const vatCost = (cifValue + dutyCost) * VAT_RATE;

    // Domestic delivery
    const isRemote = ['澎湖縣', '金門縣', '連江縣', '花蓮縣', '台東縣'].includes(city);
    const domesticDelivery = isRemote ? 5000 : 2500;

    const totalLandedCost = value + shippingCost + insuranceCost + dutyCost + vatCost + domesticDelivery;

    return {
      cbm: cbm.toFixed(3),
      shippingCost: Math.round(shippingCost),
      dutyCost: Math.round(dutyCost),
      vatCost: Math.round(vatCost),
      insuranceCost: Math.round(insuranceCost),
      domesticDelivery,
      totalLandedCost: Math.round(totalLandedCost),
    };
  }, [dimensions, shippingMethod, goodsValue, city]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-bold text-charcoal">
          運費計算
        </h1>
        <p className="mt-3 text-walnut/70">
          估算您的歐洲古董家具國際運費與到府總成本
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-serif text-lg font-semibold text-charcoal">
                商品資訊
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-walnut">
                  商品類別（自動帶入平均尺寸）
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full border border-linen bg-white px-4 py-2.5 text-sm text-charcoal focus:border-brass focus:outline-none"
                >
                  <option value="">自行輸入尺寸</option>
                  {Object.entries(CATEGORY_AVERAGES).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="length"
                  label="長度 (cm)"
                  type="number"
                  placeholder="0"
                  value={dimensions.length}
                  onChange={(e) =>
                    setDimensions((prev) => ({
                      ...prev,
                      length: e.target.value,
                    }))
                  }
                />
                <Input
                  id="width"
                  label="寬度 (cm)"
                  type="number"
                  placeholder="0"
                  value={dimensions.width}
                  onChange={(e) =>
                    setDimensions((prev) => ({
                      ...prev,
                      width: e.target.value,
                    }))
                  }
                />
                <Input
                  id="height"
                  label="高度 (cm)"
                  type="number"
                  placeholder="0"
                  value={dimensions.height}
                  onChange={(e) =>
                    setDimensions((prev) => ({
                      ...prev,
                      height: e.target.value,
                    }))
                  }
                />
                <Input
                  id="weight"
                  label="重量 (kg)"
                  type="number"
                  placeholder="0"
                  value={dimensions.weight}
                  onChange={(e) =>
                    setDimensions((prev) => ({
                      ...prev,
                      weight: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Goods Value */}
              <Input
                id="goodsValue"
                label="商品價值 (TWD)"
                type="number"
                placeholder="100000"
                value={goodsValue}
                onChange={(e) => setGoodsValue(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-serif text-lg font-semibold text-charcoal">
                配送資訊
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Destination */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-walnut">
                  配送城市
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-linen bg-white px-4 py-2.5 text-sm text-charcoal focus:border-brass focus:outline-none"
                >
                  {TAIWAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shipping Method */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-walnut">
                  運送方式
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('lcl')}
                    className={`border px-4 py-3 text-sm transition-colors ${
                      shippingMethod === 'lcl'
                        ? 'border-brass bg-brass/10 text-brass font-medium'
                        : 'border-linen text-walnut/60 hover:border-walnut/30'
                    }`}
                  >
                    <span className="block font-medium">LCL 併櫃</span>
                    <span className="mt-0.5 block text-xs">依體積計費</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingMethod('fcl')}
                    className={`border px-4 py-3 text-sm transition-colors ${
                      shippingMethod === 'fcl'
                        ? 'border-brass bg-brass/10 text-brass font-medium'
                        : 'border-linen text-walnut/60 hover:border-walnut/30'
                    }`}
                  >
                    <span className="block font-medium">FCL 整櫃</span>
                    <span className="mt-0.5 block text-xs">20 呎貨櫃</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Result Section */}
        <div>
          <Card className={result ? '' : 'opacity-50'}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-brass" />
                <h2 className="font-serif text-lg font-semibold text-charcoal">
                  費用估算
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  {/* Volume */}
                  <div className="flex items-center justify-between border-b border-linen pb-3">
                    <span className="text-sm text-walnut/70">
                      體積 (CBM)
                    </span>
                    <span className="text-sm font-medium text-charcoal">
                      {result.cbm} m&sup3;
                    </span>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-walnut/70">商品價值</span>
                      <span className="text-sm text-charcoal">
                        NT$ {parseInt(goodsValue || '0').toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-walnut/70">
                        海運運費（{shippingMethod === 'lcl' ? 'LCL' : 'FCL'}）
                      </span>
                      <span className="text-sm text-charcoal">
                        NT$ {result.shippingCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-walnut/70">
                        貨物保險（1.5%）
                      </span>
                      <span className="text-sm text-charcoal">
                        NT$ {result.insuranceCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-walnut/70">
                        進口關稅（6.5%）
                      </span>
                      <span className="text-sm text-charcoal">
                        NT$ {result.dutyCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-walnut/70">
                        營業稅（5%）
                      </span>
                      <span className="text-sm text-charcoal">
                        NT$ {result.vatCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-walnut/70">
                        國內配送
                      </span>
                      <span className="text-sm text-charcoal">
                        NT$ {result.domesticDelivery.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between border-t border-linen pt-4">
                    <span className="text-base font-semibold text-charcoal">
                      預估總到府成本
                    </span>
                    <span className="text-xl font-bold text-brass">
                      NT$ {result.totalLandedCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Calculator className="mx-auto h-8 w-8 text-walnut/30" />
                  <p className="mt-3 text-sm text-walnut/50">
                    請輸入商品尺寸以計算費用
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="mt-6 flex gap-2 rounded bg-brass/5 p-4">
            <Info className="h-4 w-4 shrink-0 text-brass mt-0.5" />
            <div className="text-xs leading-relaxed text-walnut/60">
              <p className="font-medium text-walnut">注意事項</p>
              <ul className="mt-1 list-disc pl-4 space-y-1">
                <li>以上費用為預估值，實際費用可能因匯率波動、商品實際尺寸及重量而有所調整。</li>
                <li>LCL 海運運費以每 CBM NT$12,000 計算，最低收費 NT$8,000。</li>
                <li>關稅稅率依商品材質與年代可能有所不同，古董品（超過 100 年）可能享有免稅優惠。</li>
                <li>偏遠地區（離島、花東）配送費用較高。</li>
                <li>如需更精確的報價，請直接聯繫我們的客服團隊。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
