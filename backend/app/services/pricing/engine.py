"""Pricing calculation engine.

Calculates the total TWD price from EUR source price including all cost
components: markup, international shipping, customs, VAT, insurance, packaging.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from app.services.pricing.exchange import get_eur_twd_rate

# Designers that command a premium markup
PREMIUM_DESIGNERS: list[str] = [
    "Arne Jacobsen",
    "Hans Wegner",
    "Finn Juhl",
    "Charles Eames",
    "Ray Eames",
    "Eero Saarinen",
    "Verner Panton",
    "Alvar Aalto",
    "Le Corbusier",
    "Charlotte Perriand",
    "Dieter Rams",
    "Ettore Sottsass",
    "Gio Ponti",
    "Joe Colombo",
    "Poul Henningsen",
    "Isamu Noguchi",
    "George Nelson",
    "Ludwig Mies van der Rohe",
    "Marcel Breuer",
    "Børge Mogensen",
]

# Customs duty rates by HS code prefix
CUSTOMS_DUTY_RATES: dict[str, float] = {
    "9401": 0.0,    # Seats (0% for most furniture)
    "9403": 0.0,    # Other furniture
    "9405": 0.05,   # Lighting (5%)
    "default": 0.0,
}

VAT_RATE = 0.05  # Taiwan VAT 5%
INSURANCE_RATE = 0.015  # 1.5% of product value
EXCHANGE_BUFFER_PCT = 3.0  # 3% exchange rate buffer


@dataclass
class PricingInput:
    price_eur: float
    volume_cbm: float
    category: str = "other"
    designer: Optional[str] = None
    hs_code: str = "9403.60"


@dataclass
class PricingResult:
    original_eur: float = 0.0
    exchange_rate: float = 0.0
    exchange_buffer_pct: float = EXCHANGE_BUFFER_PCT
    base_twd: float = 0.0
    markup_pct: float = 0.0
    markup_twd: float = 0.0
    international_shipping_twd: float = 0.0
    customs_duty_twd: float = 0.0
    customs_duty_pct: float = 0.0
    vat_twd: float = 0.0
    insurance_twd: float = 0.0
    packaging_twd: float = 0.0
    domestic_shipping_twd: float = 0.0
    total_twd: float = 0.0
    margin_twd: float = 0.0


class PricingEngine:
    """Calculate the full TWD landed cost from a EUR source price."""

    def _get_markup_pct(self, price_eur: float, designer: Optional[str]) -> float:
        """Determine markup percentage based on price tier and designer.

        Tiers:
          < 500 EUR  -> 40%
          500-2000    -> 30%
          2000-5000   -> 25%
          > 5000      -> 20%
        Premium designer bonus: +5%
        """
        if price_eur < 500:
            pct = 40.0
        elif price_eur < 2000:
            pct = 30.0
        elif price_eur < 5000:
            pct = 25.0
        else:
            pct = 20.0

        if designer and any(
            d.lower() in designer.lower() for d in PREMIUM_DESIGNERS
        ):
            pct += 5.0

        return pct

    def _estimate_shipping_eur(self, volume_cbm: float) -> float:
        """Estimate international shipping cost in EUR based on volume.

        Rate: ~250 EUR per CBM (sea freight), minimum 80 EUR.
        """
        cost = max(volume_cbm * 250, 80.0)
        return round(cost, 2)

    def _get_customs_duty_pct(self, hs_code: str) -> float:
        """Get customs duty rate by HS code prefix."""
        prefix = hs_code[:4] if hs_code else "default"
        return CUSTOMS_DUTY_RATES.get(prefix, CUSTOMS_DUTY_RATES["default"])

    def _estimate_packaging_twd(self, volume_cbm: float) -> float:
        """Estimate packaging/crating cost in TWD.

        Rate: ~5000 TWD per CBM, minimum 1500 TWD.
        """
        return max(volume_cbm * 5000, 1500.0)

    def calculate(self, inp: PricingInput) -> PricingResult:
        """Run full pricing calculation."""
        rate = get_eur_twd_rate()
        buffered_rate = rate * (1 + EXCHANGE_BUFFER_PCT / 100)

        # Base TWD price
        base_twd = inp.price_eur * buffered_rate

        # Markup
        markup_pct = self._get_markup_pct(inp.price_eur, inp.designer)
        markup_twd = base_twd * (markup_pct / 100)

        # International shipping
        shipping_eur = self._estimate_shipping_eur(inp.volume_cbm)
        international_shipping_twd = shipping_eur * buffered_rate

        # Customs duty
        customs_duty_pct = self._get_customs_duty_pct(inp.hs_code)
        customs_duty_twd = (base_twd + international_shipping_twd) * customs_duty_pct

        # VAT (on CIF + duty)
        vat_twd = (base_twd + international_shipping_twd + customs_duty_twd) * VAT_RATE

        # Insurance
        insurance_twd = base_twd * INSURANCE_RATE

        # Packaging
        packaging_twd = self._estimate_packaging_twd(inp.volume_cbm)

        # Domestic shipping (flat estimate)
        domestic_shipping_twd = 2000.0

        # Total
        total_twd = (
            base_twd
            + markup_twd
            + international_shipping_twd
            + customs_duty_twd
            + vat_twd
            + insurance_twd
            + packaging_twd
            + domestic_shipping_twd
        )

        # Round up to nearest 100
        total_twd = float(int(((total_twd + 99) // 100) * 100))

        margin_twd = markup_twd

        return PricingResult(
            original_eur=inp.price_eur,
            exchange_rate=rate,
            exchange_buffer_pct=EXCHANGE_BUFFER_PCT,
            base_twd=round(base_twd, 0),
            markup_pct=markup_pct,
            markup_twd=round(markup_twd, 0),
            international_shipping_twd=round(international_shipping_twd, 0),
            customs_duty_twd=round(customs_duty_twd, 0),
            customs_duty_pct=customs_duty_pct * 100,
            vat_twd=round(vat_twd, 0),
            insurance_twd=round(insurance_twd, 0),
            packaging_twd=round(packaging_twd, 0),
            domestic_shipping_twd=domestic_shipping_twd,
            total_twd=total_twd,
            margin_twd=round(margin_twd, 0),
        )
