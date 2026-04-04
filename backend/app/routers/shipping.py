"""Shipping calculator endpoint."""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.pricing.engine import PricingEngine, PricingInput

router = APIRouter()


class ShippingRequest(BaseModel):
    price_eur: float
    volume_cbm: float
    category: str = "other"
    designer: Optional[str] = None
    hs_code: str = "9403.60"
    destination_city: Optional[str] = None


class ShippingResponse(BaseModel):
    international_shipping_twd: float
    customs_duty_twd: float
    vat_twd: float
    insurance_twd: float
    packaging_twd: float
    domestic_shipping_twd: float
    total_shipping_twd: float
    total_landed_twd: float


@router.post("/calculate", response_model=ShippingResponse)
async def calculate_shipping(request: ShippingRequest):
    """Calculate full shipping / landed cost breakdown."""
    engine = PricingEngine()
    result = engine.calculate(
        PricingInput(
            price_eur=request.price_eur,
            volume_cbm=request.volume_cbm,
            category=request.category,
            designer=request.designer,
            hs_code=request.hs_code,
        )
    )

    total_shipping = (
        result.international_shipping_twd
        + result.customs_duty_twd
        + result.vat_twd
        + result.insurance_twd
        + result.packaging_twd
        + result.domestic_shipping_twd
    )

    return ShippingResponse(
        international_shipping_twd=result.international_shipping_twd,
        customs_duty_twd=result.customs_duty_twd,
        vat_twd=result.vat_twd,
        insurance_twd=result.insurance_twd,
        packaging_twd=result.packaging_twd,
        domestic_shipping_twd=result.domestic_shipping_twd,
        total_shipping_twd=round(total_shipping, 0),
        total_landed_twd=result.total_twd,
    )
