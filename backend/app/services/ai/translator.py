"""Stage 1: Translation using Claude API."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional

import anthropic

from config import settings

logger = logging.getLogger(__name__)


@dataclass
class TranslationResult:
    title_zh: str
    description_zh: str
    condition_zh: Optional[str] = None
    confidence: float = 0.0


async def translate_product(
    title: str,
    description: str,
    condition: Optional[str] = None,
) -> TranslationResult:
    """Translate product text from English/European to Traditional Chinese."""
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    prompt = f"""Translate the following vintage/antique furniture product information
into Traditional Chinese (繁體中文). Preserve technical furniture terminology.
Use terms familiar to Taiwanese consumers.

Title: {title}

Description: {description}

Condition: {condition or 'N/A'}

Respond in JSON format:
{{
  "title_zh": "...",
  "description_zh": "...",
  "condition_zh": "...",
  "confidence": 0.95
}}

Only output JSON, no other text."""

    try:
        message = await client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}],
        )
        import json

        text = message.content[0].text.strip()
        # Strip markdown code fences if present
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            text = text.rsplit("```", 1)[0]
        data = json.loads(text)
        return TranslationResult(
            title_zh=data.get("title_zh", ""),
            description_zh=data.get("description_zh", ""),
            condition_zh=data.get("condition_zh"),
            confidence=data.get("confidence", 0.85),
        )
    except Exception as exc:
        logger.error(f"Translation failed: {exc}")
        return TranslationResult(
            title_zh=title,
            description_zh=description,
            condition_zh=condition,
            confidence=0.0,
        )
