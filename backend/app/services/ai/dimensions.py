"""Stage 3: Dimension estimation with three-tier fallback."""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from typing import Optional

import anthropic

from config import settings
from app.utils.helpers import calculate_volume_cbm

logger = logging.getLogger(__name__)

# Category average dimensions (width, depth, height) in cm
CATEGORY_AVERAGES: dict[str, tuple[float, float, float]] = {
    "tables": (120.0, 75.0, 75.0),
    "chairs": (50.0, 55.0, 80.0),
    "sofas": (200.0, 85.0, 80.0),
    "storage": (90.0, 45.0, 120.0),
    "lighting": (40.0, 40.0, 50.0),
    "desks": (130.0, 65.0, 75.0),
    "cabinets": (100.0, 45.0, 180.0),
    "sideboards": (160.0, 45.0, 80.0),
    "armchairs": (70.0, 75.0, 85.0),
    "shelving": (80.0, 30.0, 180.0),
    "mirrors": (60.0, 5.0, 80.0),
    "beds": (160.0, 200.0, 90.0),
    "decorative": (30.0, 30.0, 30.0),
    "other": (80.0, 50.0, 80.0),
}


@dataclass
class DimensionResult:
    width_cm: float
    depth_cm: float
    height_cm: float
    volume_cbm: float
    estimation_method: str  # "scraped" | "ai_estimated" | "category_average"
    confidence: float = 1.0


async def estimate_dimensions(
    *,
    scraped_width: Optional[float] = None,
    scraped_depth: Optional[float] = None,
    scraped_height: Optional[float] = None,
    title: str = "",
    description: str = "",
    category: str = "other",
) -> DimensionResult:
    """Three-tier fallback for dimensions: scraped -> AI estimated -> category average."""

    # Tier 1: Use scraped dimensions if all three are available
    if all(v and v > 0 for v in [scraped_width, scraped_depth, scraped_height]):
        vol = calculate_volume_cbm(scraped_width, scraped_depth, scraped_height)
        return DimensionResult(
            width_cm=scraped_width,
            depth_cm=scraped_depth,
            height_cm=scraped_height,
            volume_cbm=vol,
            estimation_method="scraped",
            confidence=1.0,
        )

    # Tier 2: AI estimation from title + description
    if title and settings.anthropic_api_key:
        try:
            result = await _ai_estimate(title, description, category)
            if result:
                return result
        except Exception as exc:
            logger.warning(f"AI dimension estimation failed: {exc}")

    # Tier 3: Category averages
    w, d, h = CATEGORY_AVERAGES.get(category, CATEGORY_AVERAGES["other"])
    vol = calculate_volume_cbm(w, d, h)
    return DimensionResult(
        width_cm=w,
        depth_cm=d,
        height_cm=h,
        volume_cbm=vol,
        estimation_method="category_average",
        confidence=0.3,
    )


async def _ai_estimate(
    title: str, description: str, category: str
) -> Optional[DimensionResult]:
    """Use Claude to estimate dimensions from product description."""
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    prompt = f"""Estimate the physical dimensions of this vintage furniture item in centimeters.

Title: {title}
Description: {description}
Category: {category}

Respond in JSON only:
{{
  "width_cm": 120,
  "depth_cm": 60,
  "height_cm": 75,
  "confidence": 0.7
}}"""

    message = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}],
    )
    text = message.content[0].text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]
    data = json.loads(text)
    w = float(data["width_cm"])
    d = float(data["depth_cm"])
    h = float(data["height_cm"])
    conf = float(data.get("confidence", 0.6))
    vol = calculate_volume_cbm(w, d, h)
    return DimensionResult(
        width_cm=w,
        depth_cm=d,
        height_cm=h,
        volume_cbm=vol,
        estimation_method="ai_estimated",
        confidence=conf,
    )
