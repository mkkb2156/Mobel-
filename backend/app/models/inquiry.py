"""Inquiry Pydantic models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr


class InquiryStatus(str, Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    QUOTED = "quoted"
    CLOSED = "closed"


class InquiryCreate(BaseModel):
    product_id: Optional[str] = None
    source_url: Optional[str] = None
    name: str
    email: EmailStr
    line_id: Optional[str] = None
    message: str
    preferred_contact: str = "email"


class InquiryRead(BaseModel):
    id: str
    product_id: Optional[str] = None
    source_url: Optional[str] = None
    name: str
    email: str
    line_id: Optional[str] = None
    message: str
    preferred_contact: str
    status: InquiryStatus
    admin_notes: Optional[str] = None
    quoted_price_twd: Optional[float] = None
    created_at: datetime
    updated_at: datetime
