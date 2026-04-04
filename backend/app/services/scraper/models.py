"""Scraper data models."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional


@dataclass
class RawProduct:
    """Raw product data from a listing page."""
    source_url: str
    source_id: str
    title: str
    price_eur: Optional[float] = None
    price_on_request: bool = False
    thumbnail_url: Optional[str] = None
    dealer_name: Optional[str] = None
    category: Optional[str] = None


@dataclass
class ProductDetail:
    """Full product detail from a detail page."""
    source_url: str
    source_id: str
    title: str
    description: str = ""
    price_eur: Optional[float] = None
    price_on_request: bool = False
    images: List[str] = field(default_factory=list)
    designer: Optional[str] = None
    manufacturer: Optional[str] = None
    period: Optional[str] = None
    condition: Optional[str] = None
    width_cm: Optional[float] = None
    depth_cm: Optional[float] = None
    height_cm: Optional[float] = None
    materials: List[str] = field(default_factory=list)
    style: Optional[str] = None
    dealer: Optional["ScrapedDealer"] = None
    scraped_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class ScrapedDealer:
    """Dealer info from a product page."""
    name: str
    url: Optional[str] = None
    location: Optional[str] = None
    rating: Optional[float] = None
