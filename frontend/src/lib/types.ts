// ============================================================
// MÖBEL TypeScript Types - matching the DB schema
// ============================================================

export interface Product {
  id: string;
  slug: string;
  title: string;
  title_zh: string;
  description: string | null;
  description_zh: string | null;
  price_eur: number;
  price_twd: number;
  category: string;
  style: string | null;
  period: string | null;
  condition: "excellent" | "good" | "fair" | "restored";
  dimensions: Dimensions | null;
  materials: string[];
  images: ProductImage[];
  designer_id: string | null;
  dealer_id: string | null;
  source_url: string | null;
  status: "draft" | "pending_review" | "active" | "sold" | "archived";
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
  unit: "cm" | "in";
}

export interface ProductImage {
  url: string;
  alt: string;
  order: number;
}

export interface Designer {
  id: string;
  slug: string;
  name: string;
  name_zh: string | null;
  bio: string | null;
  bio_zh: string | null;
  country: string | null;
  born_year: number | null;
  died_year: number | null;
  image_url: string | null;
  created_at: string;
}

export interface Dealer {
  id: string;
  name: string;
  country: string;
  website: string | null;
  contact_email: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  product_id: string;
  status: OrderStatus;
  price_twd: number;
  shipping_cost_twd: number;
  total_twd: number;
  shipping_address: ShippingAddress;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "in_transit"
  | "customs"
  | "delivered"
  | "cancelled";

export interface ShippingAddress {
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface Inquiry {
  id: string;
  user_id: string;
  product_id: string;
  message: string;
  status: "open" | "replied" | "closed";
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "customer" | "admin";
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Shipment {
  id: string;
  order_id: string;
  carrier: string;
  tracking_number: string;
  status: string;
  origin_country: string;
  estimated_arrival: string | null;
  actual_arrival: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomsDeclaration {
  id: string;
  shipment_id: string;
  declaration_number: string | null;
  status: "pending" | "submitted" | "cleared" | "held" | "rejected";
  duty_amount_twd: number | null;
  tax_amount_twd: number | null;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  product_id: string;
  dealer_id: string;
  cost_eur: number;
  status: "pending" | "confirmed" | "paid" | "shipped" | "received";
  notes: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
  dealer?: Dealer;
}

export interface ScraperJob {
  id: string;
  source: string;
  url: string;
  status: "pending" | "running" | "completed" | "failed";
  items_found: number;
  items_imported: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

// Utility types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface FilterParams {
  category?: string;
  style?: string;
  condition?: string;
  min_price?: number;
  max_price?: number;
  designer_id?: string;
  sort_by?: "price_asc" | "price_desc" | "newest" | "oldest";
  search?: string;
  page?: number;
  per_page?: number;
}
