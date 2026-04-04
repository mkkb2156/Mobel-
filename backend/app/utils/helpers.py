"""Utility functions."""

from __future__ import annotations

import re
import unicodedata
from datetime import datetime, timezone


def slugify(text: str) -> str:
    """Generate a URL-friendly slug from text."""
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def eur_to_twd(eur: float, rate: float, buffer_pct: float = 3.0) -> float:
    """Convert EUR to TWD with exchange rate buffer."""
    buffered_rate = rate * (1 + buffer_pct / 100)
    return round(eur * buffered_rate, 0)


def calculate_volume_cbm(width_cm: float, depth_cm: float, height_cm: float) -> float:
    """Calculate volume in cubic meters from cm dimensions."""
    return round((width_cm * depth_cm * height_cm) / 1_000_000, 4)


def round_up_to_hundred(value: float) -> int:
    """Round up to the nearest hundred TWD."""
    return int(((value + 99) // 100) * 100)
