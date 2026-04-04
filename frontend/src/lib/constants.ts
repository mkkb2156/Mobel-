export const SITE_NAME = "MOBEL";
export const SITE_TITLE = "MOBEL - 歐洲古董家具";
export const SITE_DESCRIPTION =
  "精選歐洲古董家具，為您的空間增添獨特韻味。來自歐洲各地的經典設計師作品，直送台灣。";

export const CATEGORIES = [
  { slug: "seating", label: "座椅", labelEn: "Seating" },
  { slug: "tables", label: "桌几", labelEn: "Tables" },
  { slug: "storage", label: "收納", labelEn: "Storage" },
  { slug: "lighting", label: "燈具", labelEn: "Lighting" },
  { slug: "decor", label: "裝飾", labelEn: "Decor" },
  { slug: "outdoor", label: "戶外", labelEn: "Outdoor" },
] as const;

export const STYLES = [
  { slug: "mid-century", label: "中世紀現代", labelEn: "Mid-Century Modern" },
  { slug: "art-deco", label: "裝飾藝術", labelEn: "Art Deco" },
  { slug: "scandinavian", label: "北歐風格", labelEn: "Scandinavian" },
  { slug: "bauhaus", label: "包浩斯", labelEn: "Bauhaus" },
  { slug: "industrial", label: "工業風格", labelEn: "Industrial" },
  { slug: "french-provincial", label: "法式鄉村", labelEn: "French Provincial" },
] as const;

export const CONDITION_LABELS: Record<string, string> = {
  excellent: "極佳",
  good: "良好",
  fair: "尚可",
  restored: "已修復",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "待處理",
  confirmed: "已確認",
  shipped: "已出貨",
  in_transit: "運送中",
  customs: "清關中",
  delivered: "已送達",
  cancelled: "已取消",
};

export const NAV_LINKS = [
  { href: "/products", label: "所有商品" },
  { href: "/designers", label: "設計師" },
  { href: "/categories/seating", label: "座椅" },
  { href: "/categories/tables", label: "桌几" },
  { href: "/categories/lighting", label: "燈具" },
  { href: "/about", label: "關於我們" },
  { href: "/how-it-works", label: "購買流程" },
] as const;

export const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "總覽" },
  { href: "/admin/products", label: "商品管理" },
  { href: "/admin/review", label: "審核中心" },
  { href: "/admin/orders", label: "訂單管理" },
  { href: "/admin/purchases", label: "採購管理" },
  { href: "/admin/scraper", label: "爬蟲管理" },
  { href: "/admin/shipments", label: "物流管理" },
  { href: "/admin/customs", label: "報關管理" },
  { href: "/admin/analytics", label: "數據分析" },
] as const;

export const ACCOUNT_NAV_LINKS = [
  { href: "/account", label: "帳戶總覽" },
  { href: "/account/orders", label: "我的訂單" },
  { href: "/account/wishlist", label: "收藏清單" },
  { href: "/account/inquiries", label: "我的詢問" },
  { href: "/account/addresses", label: "地址管理" },
] as const;
