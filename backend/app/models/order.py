"""Order Pydantic models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel


class OrderStatus(str, Enum):
    PENDING_PAYMENT = "pending_payment"
    PAID = "paid"
    PURCHASING = "purchasing"
    PURCHASED = "purchased"
    SHIPPING_TO_WAREHOUSE = "shipping_to_warehouse"
    AT_WAREHOUSE = "at_warehouse"
    SHIPPING_TO_TAIWAN = "shipping_to_taiwan"
    CUSTOMS_CLEARANCE = "customs_clearance"
    DOMESTIC_DELIVERY = "domestic_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class OrderCreate(BaseModel):
    product_id: str
    user_id: str
    shipping_address_id: str
    notes: Optional[str] = None


class OrderRead(BaseModel):
    id: str
    order_number: str
    user_id: str
    product_id: str
    status: OrderStatus
    total_twd: float
    paid_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class OrderListItem(BaseModel):
    id: str
    order_number: str
    status: OrderStatus
    total_twd: float
    product_title: Optional[str] = None
    product_thumbnail: Optional[str] = None
    created_at: datetime
