"""Product Pydantic models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field, HttpUrl


class ProductStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SOLD = "sold"
    UNAVAILABLE = "unavailable"


class QualityGrade(str, Enum):
    A = "A"
    B = "B"
    C = "C"


class Dimensions(BaseModel):
    width_cm: Optional[float] = None
    depth_cm: Optional[float] = None
    height_cm: Optional[float] = None
    volume_cbm: Optional[float] = None
    estimation_method: Optional[str] = None  # scraped | ai_estimated | category_average


class PricingBreakdown(BaseModel):
    original_eur: float
    exchange_rate: float
    exchange_buffer_pct: float = 3.0
    base_twd: float
    markup_pct: float
    markup_twd: float
    international_shipping_twd: float
    customs_duty_twd: float
    customs_duty_pct: float
    vat_twd: float
    insurance_twd: float
    packaging_twd: float
    domestic_shipping_twd: float = 0.0
    total_twd: float
    margin_twd: float


class ProductBase(BaseModel):
    source_url: str
    source_id: str
    title_original: str
    title_zh: Optional[str] = None
    description_original: Optional[str] = None
    description_zh: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    style: Optional[str] = None
    period: Optional[str] = None
    materials: List[str] = Field(default_factory=list)
    designer: Optional[str] = None
    manufacturer: Optional[str] = None
    condition_original: Optional[str] = None
    condition_zh: Optional[str] = None
    quality_grade: Optional[QualityGrade] = None
    dimensions: Optional[Dimensions] = None
    price_eur: Optional[float] = None
    price_on_request: bool = False
    pricing: Optional[PricingBreakdown] = None
    total_price_twd: Optional[float] = None
    images: List[str] = Field(default_factory=list)
    thumbnail: Optional[str] = None
    dealer_id: Optional[str] = None
    hs_code: Optional[str] = None
    ai_confidence: Optional[float] = None


class ProductCreate(ProductBase):
    pass


class ProductRead(ProductBase):
    id: str
    slug: str
    status: ProductStatus = ProductStatus.PENDING
    created_at: datetime
    updated_at: datetime
    last_scraped_at: Optional[datetime] = None


class ProductListItem(BaseModel):
    id: str
    slug: str
    title_zh: Optional[str] = None
    title_original: str
    category: Optional[str] = None
    style: Optional[str] = None
    designer: Optional[str] = None
    quality_grade: Optional[QualityGrade] = None
    total_price_twd: Optional[float] = None
    price_eur: Optional[float] = None
    price_on_request: bool = False
    thumbnail: Optional[str] = None
    status: ProductStatus = ProductStatus.PENDING
    created_at: datetime


class ProductSearchQuery(BaseModel):
    q: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    style: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    designer: Optional[str] = None
    quality_grade: Optional[QualityGrade] = None
    sort_by: str = "created_at"
    sort_order: str = "desc"
    page: int = 1
    page_size: int = 24
