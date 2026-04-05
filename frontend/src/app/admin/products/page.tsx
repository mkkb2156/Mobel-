"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
type BadgeVariant = "default" | "success" | "warning" | "error" | "info";
type ProductStatus = "active" | "draft" | "sold" | "processing" | "archived";

interface MockProduct {
  id: string;
  imageUrl: string;
  name: string;
  nameZh: string;
  category: string;
  designer: string;
  priceEur: number;
  priceTwd: number;
  status: ProductStatus;
  listedDate: string;
}

const statusConfig: Record<ProductStatus, { label: string; variant: BadgeVariant }> = {
  active: { label: "上架中", variant: "success" },
  draft: { label: "草稿", variant: "default" },
  sold: { label: "已售出", variant: "error" },
  processing: { label: "處理中", variant: "warning" },
  archived: { label: "已下架", variant: "default" },
};

const mockProducts: MockProduct[] = [
  { id: "p1", imageUrl: "", name: "CH24 Wishbone Chair", nameZh: "CH24 Y椅", category: "座椅", designer: "Hans J. Wegner", priceEur: 2800, priceTwd: 96600, status: "active", listedDate: "2026-03-15" },
  { id: "p2", imageUrl: "", name: "Egg Chair", nameZh: "蛋椅", category: "座椅", designer: "Arne Jacobsen", priceEur: 12500, priceTwd: 431250, status: "active", listedDate: "2026-03-12" },
  { id: "p3", imageUrl: "", name: "PH 5 Pendant", nameZh: "PH 5 吊燈", category: "燈具", designer: "Poul Henningsen", priceEur: 1800, priceTwd: 62100, status: "active", listedDate: "2026-03-10" },
  { id: "p4", imageUrl: "", name: "Model 60 Stool", nameZh: "60號凳子", category: "座椅", designer: "Alvar Aalto", priceEur: 450, priceTwd: 15525, status: "draft", listedDate: "2026-04-01" },
  { id: "p5", imageUrl: "", name: "Tulip Dining Table", nameZh: "鬱金香餐桌", category: "桌几", designer: "Eero Saarinen", priceEur: 5800, priceTwd: 200100, status: "active", listedDate: "2026-02-28" },
  { id: "p6", imageUrl: "", name: "LC4 Chaise Longue", nameZh: "LC4 躺椅", category: "座椅", designer: "Le Corbusier", priceEur: 8900, priceTwd: 307050, status: "sold", listedDate: "2026-01-20" },
  { id: "p7", imageUrl: "", name: "AJ Floor Lamp", nameZh: "AJ 落地燈", category: "燈具", designer: "Arne Jacobsen", priceEur: 2200, priceTwd: 75900, status: "active", listedDate: "2026-03-18" },
  { id: "p8", imageUrl: "", name: "PP Mobler Bear Chair", nameZh: "熊椅", category: "座椅", designer: "Hans J. Wegner", priceEur: 18500, priceTwd: 638250, status: "processing", listedDate: "2026-04-02" },
  { id: "p9", imageUrl: "", name: "String Shelf System", nameZh: "String 層架系統", category: "收納", designer: "Nisse Strinning", priceEur: 680, priceTwd: 23460, status: "active", listedDate: "2026-03-05" },
  { id: "p10", imageUrl: "", name: "Pelican Chair", nameZh: "鵜鶘椅", category: "座椅", designer: "Finn Juhl", priceEur: 15200, priceTwd: 524400, status: "active", listedDate: "2026-02-14" },
  { id: "p11", imageUrl: "", name: "Artichoke Pendant", nameZh: "松果吊燈", category: "燈具", designer: "Poul Henningsen", priceEur: 9800, priceTwd: 338100, status: "active", listedDate: "2026-03-22" },
  { id: "p12", imageUrl: "", name: "French Provincial Armoire", nameZh: "法式鄉村衣櫃", category: "收納", designer: "Unknown", priceEur: 3500, priceTwd: 120750, status: "draft", listedDate: "2026-04-03" },
  { id: "p13", imageUrl: "", name: "Barcelona Chair", nameZh: "巴塞隆納椅", category: "座椅", designer: "Mies van der Rohe", priceEur: 7200, priceTwd: 248400, status: "sold", listedDate: "2026-01-15" },
  { id: "p14", imageUrl: "", name: "Noguchi Coffee Table", nameZh: "野口咖啡桌", category: "桌几", designer: "Isamu Noguchi", priceEur: 4500, priceTwd: 155250, status: "active", listedDate: "2026-03-01" },
  { id: "p15", imageUrl: "", name: "Flowerpot VP1 Pendant", nameZh: "花盆吊燈 VP1", category: "燈具", designer: "Verner Panton", priceEur: 620, priceTwd: 21390, status: "active", listedDate: "2026-03-25" },
];

const statsCounts = {
  total: mockProducts.length,
  active: mockProducts.filter((p) => p.status === "active").length,
  draft: mockProducts.filter((p) => p.status === "draft").length,
  sold: mockProducts.filter((p) => p.status === "sold").length,
  processing: mockProducts.filter((p) => p.status === "processing").length,
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const perPage = 8;

  const filtered = mockProducts.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.nameZh.includes(search)) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((p) => p.id)));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">商品管理</h1>
          <p className="mt-2 text-sm text-walnut/70">管理所有商品列表</p>
        </div>
        <Button variant="primary">新增商品</Button>
      </div>

      {/* Stats Bar */}
      <div className="mt-6 flex flex-wrap gap-4">
        {([
          ["全部", statsCounts.total],
          ["上架中", statsCounts.active],
          ["草稿", statsCounts.draft],
          ["已售出", statsCounts.sold],
          ["處理中", statsCounts.processing],
        ] as const).map(([label, count]) => (
          <div key={label} className="border border-linen bg-white px-4 py-3">
            <span className="text-xs text-walnut/60">{label}</span>
            <span className="ml-2 font-serif text-lg font-bold text-charcoal">{count}</span>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="mt-4 flex flex-wrap items-end gap-3 border border-linen bg-white p-4">
        <div className="w-64">
          <Input
            placeholder="搜尋商品名稱..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <select
          className="border border-linen bg-white px-3 py-2.5 text-sm text-charcoal focus:border-brass focus:outline-none"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as ProductStatus | "all"); setCurrentPage(1); }}
        >
          <option value="all">所有狀態</option>
          <option value="active">上架中</option>
          <option value="draft">草稿</option>
          <option value="sold">已售出</option>
          <option value="processing">處理中</option>
        </select>
        <select
          className="border border-linen bg-white px-3 py-2.5 text-sm text-charcoal focus:border-brass focus:outline-none"
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
        >
          <option value="all">所有分類</option>
          <option value="座椅">座椅</option>
          <option value="桌几">桌几</option>
          <option value="收納">收納</option>
          <option value="燈具">燈具</option>
          <option value="裝飾">裝飾</option>
        </select>

        {selectedIds.size > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-walnut/60">已選 {selectedIds.size} 項</span>
            <Button variant="primary" size="sm">批次核准</Button>
            <Button variant="outline" size="sm">批次下架</Button>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="mt-4 overflow-hidden border border-linen bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-linen bg-cream/50">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selectedIds.size === paginated.length}
                    onChange={toggleAll}
                    className="accent-brass"
                  />
                </th>
                <th className="px-4 py-3 font-medium text-walnut">圖片</th>
                <th className="px-4 py-3 font-medium text-walnut">商品名稱</th>
                <th className="px-4 py-3 font-medium text-walnut">分類</th>
                <th className="px-4 py-3 font-medium text-walnut">設計師</th>
                <th className="px-4 py-3 font-medium text-walnut">價格(EUR)</th>
                <th className="px-4 py-3 font-medium text-walnut">價格(TWD)</th>
                <th className="px-4 py-3 font-medium text-walnut">狀態</th>
                <th className="px-4 py-3 font-medium text-walnut">上架日期</th>
                <th className="px-4 py-3 font-medium text-walnut">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((product) => {
                const sc = statusConfig[product.status];
                return (
                  <tr key={product.id} className="border-b border-linen/50 last:border-0 hover:bg-cream/30">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="accent-brass"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center bg-linen/50">
                        <svg className="h-5 w-5 text-walnut/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-charcoal">{product.name}</p>
                        <p className="text-xs text-walnut/60">{product.nameZh}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-walnut/80">{product.category}</td>
                    <td className="px-4 py-3 text-walnut/80">{product.designer}</td>
                    <td className="px-4 py-3 font-medium text-charcoal">&euro; {product.priceEur.toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium text-charcoal">NT$ {product.priceTwd.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant={sc.variant}>{sc.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-walnut/60">{product.listedDate}</td>
                    <td className="relative px-4 py-3">
                      <button
                        onClick={() => setOpenActionId(openActionId === product.id ? null : product.id)}
                        className="text-walnut/60 hover:text-charcoal"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                        </svg>
                      </button>
                      {openActionId === product.id && (
                        <div className="absolute right-4 top-full z-10 w-32 border border-linen bg-white py-1 shadow-lg">
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-cream/50">檢視</button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-cream/50">編輯</button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-cream/50">下架</button>
                          <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">刪除</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-walnut/60">
            顯示 {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, filtered.length)} / 共 {filtered.length} 筆
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-brass text-cream"
                    : "border border-linen bg-white text-walnut hover:bg-cream/50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
