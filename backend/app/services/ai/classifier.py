"""Stage 2: Classification using Claude API."""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field
from typing import List, Optional

import anthropic

from config import settings

logger = logging.getLogger(__name__)


@dataclass
class ClassificationResult:
    category: str = ""
    subcategory: str = ""
    style: str = ""
    materials: List[str] = field(default_factory=list)
    hs_code: str = ""
    confidence: float = 0.0


VALID_CATEGORIES = [
    "tables", "chairs", "sofas", "storage", "lighting",
    "desks", "cabinets", "sideboards", "armchairs", "shelving",
    "mirrors", "beds", "decorative", "other",
]

VALID_STYLES = [
    "mid-century-modern", "art-deco", "bauhaus", "scandinavian",
    "industrial", "danish-modern", "italian-modern", "french-provincial",
    "hollywood-regency", "brutalist", "postmodern", "victorian",
    "art-nouveau", "contemporary", "other",
]


async def classify_product(
    title: str,
    description: str,
    materials_hint: Optional[List[str]] = None,
) -> ClassificationResult:
    """Classify a product using Claude API."""
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    prompt = f"""Classify this vintage/antique furniture item.

Title: {title}
Description: {description}
Materials hint: {', '.join(materials_hint) if materials_hint else 'Unknown'}

Valid categories: {', '.join(VALID_CATEGORIES)}
Valid styles: {', '.join(VALID_STYLES)}

Determine:
1. category (from valid list)
2. subcategory (more specific, free text)
3. style (from valid list)
4. materials (list of materials)
5. hs_code (Harmonized System code for customs, typically 9401-9404 for furniture)

Respond in JSON format only:
{{
  "category": "...",
  "subcategory": "...",
  "style": "...",
  "materials": ["..."],
  "hs_code": "9401.61",
  "confidence": 0.9
}}"""

    try:
        message = await client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=512,
            messages=[{"role": "user", "content": prompt}],
        )
        text = message.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            text = text.rsplit("```", 1)[0]
        data = json.loads(text)
        return ClassificationResult(
            category=data.get("category", "other"),
            subcategory=data.get("subcategory", ""),
            style=data.get("style", "other"),
            materials=data.get("materials", []),
            hs_code=data.get("hs_code", "9403.60"),
            confidence=data.get("confidence", 0.8),
        )
    except Exception as exc:
        logger.error(f"Classification failed: {exc}")
        return ClassificationResult(confidence=0.0)
