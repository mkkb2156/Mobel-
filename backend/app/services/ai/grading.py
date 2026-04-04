"""Stage 5: Quality grading."""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from typing import Optional

import anthropic

from config import settings

logger = logging.getLogger(__name__)


@dataclass
class GradingResult:
    grade: str  # A, B, or C
    grade_label: str
    reasoning: str
    confidence: float = 0.0


GRADE_LABELS = {
    "A": "Excellent - museum quality, minimal wear",
    "B": "Good - normal age-related wear, fully functional",
    "C": "Fair - visible wear, may need minor restoration",
}


async def grade_product(
    condition_text: Optional[str] = None,
    description: str = "",
    image_count: int = 0,
    has_dimensions: bool = False,
    has_designer: bool = False,
) -> GradingResult:
    """Grade product quality as A/B/C."""

    # If we have Claude API and condition text, use AI grading
    if condition_text and settings.anthropic_api_key:
        try:
            return await _ai_grade(
                condition_text, description, image_count, has_dimensions, has_designer
            )
        except Exception as exc:
            logger.warning(f"AI grading failed, using rule-based: {exc}")

    # Rule-based fallback
    return _rule_based_grade(
        condition_text, image_count, has_dimensions, has_designer
    )


async def _ai_grade(
    condition_text: str,
    description: str,
    image_count: int,
    has_dimensions: bool,
    has_designer: bool,
) -> GradingResult:
    """Use Claude to assess quality grade."""
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    prompt = f"""Grade this vintage furniture item's quality as A, B, or C.

A = Excellent: museum quality, minimal wear, original parts, well-documented provenance
B = Good: normal age-related wear, fully functional, minor cosmetic issues  
C = Fair: visible wear/damage, may need restoration, missing parts

Condition description: {condition_text}
Product description: {description}
Number of photos: {image_count}
Has exact dimensions: {has_dimensions}
Has designer attribution: {has_designer}

Respond in JSON only:
{{
  "grade": "B",
  "reasoning": "...",
  "confidence": 0.85
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
    grade = data.get("grade", "B").upper()
    if grade not in ("A", "B", "C"):
        grade = "B"
    return GradingResult(
        grade=grade,
        grade_label=GRADE_LABELS[grade],
        reasoning=data.get("reasoning", ""),
        confidence=data.get("confidence", 0.8),
    )


def _rule_based_grade(
    condition_text: Optional[str],
    image_count: int,
    has_dimensions: bool,
    has_designer: bool,
) -> GradingResult:
    """Simple rule-based grading fallback."""
    score = 0

    if condition_text:
        text_lower = condition_text.lower()
        if any(w in text_lower for w in ["excellent", "mint", "perfect", "pristine"]):
            score += 3
        elif any(w in text_lower for w in ["good", "nice", "well"]):
            score += 2
        elif any(w in text_lower for w in ["fair", "wear", "patina", "scratches"]):
            score += 1
    else:
        score += 1  # Unknown defaults to middle

    if image_count >= 5:
        score += 1
    if has_dimensions:
        score += 1
    if has_designer:
        score += 1

    if score >= 5:
        grade = "A"
    elif score >= 3:
        grade = "B"
    else:
        grade = "C"

    return GradingResult(
        grade=grade,
        grade_label=GRADE_LABELS[grade],
        reasoning="Rule-based assessment",
        confidence=0.5,
    )
