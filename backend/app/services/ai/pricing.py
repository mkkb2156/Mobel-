"""Stage 4: Pricing engine (AI pipeline integration)."""

from __future__ import annotations

from dataclasses import dataclass

from app.services.pricing.engine import PricingEngine, PricingInput, PricingResult


@dataclass
class PricingStageResult:
    pricing: PricingResult
    confidence: float = 1.0


async def calculate_pricing(
    price_eur: float,
    volume_cbm: float,
    category: str = "other",
    designer: str | None = None,
    hs_code: str = "9403.60",
) -> PricingStageResult:
    """Pricing stage of the AI pipeline."""
    engine = PricingEngine()
    pricing_input = PricingInput(
        price_eur=price_eur,
        volume_cbm=volume_cbm,
        category=category,
        designer=designer,
        hs_code=hs_code,
    )
    result = engine.calculate(pricing_input)
    return PricingStageResult(pricing=result, confidence=1.0)
