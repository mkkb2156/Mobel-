"""User Pydantic models."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserRole(str, Enum):
    CUSTOMER = "customer"
    ADMIN = "admin"


class UserProfile(BaseModel):
    id: str
    email: EmailStr
    display_name: Optional[str] = None
    phone: Optional[str] = None
    line_id: Optional[str] = None
    role: UserRole = UserRole.CUSTOMER
    created_at: datetime
    updated_at: datetime


class AddressCreate(BaseModel):
    user_id: str
    label: str = "home"
    recipient_name: str
    phone: str
    city: str
    district: str
    postal_code: str
    address_line: str
    is_default: bool = False


class AddressRead(AddressCreate):
    id: str
    created_at: datetime
