"""Exchange rate service for EUR/TWD."""

from __future__ import annotations

import logging
import time
from typing import Optional

import httpx

from config import settings

logger = logging.getLogger(__name__)

# In-memory cache
_cached_rate: Optional[float] = None
_cached_at: float = 0.0

DEFAULT_EUR_TWD_RATE = 34.5  # Fallback rate


def get_eur_twd_rate() -> float:
    """Get current EUR to TWD exchange rate with caching.

    Falls back to default rate if API is unavailable.
    """
    global _cached_rate, _cached_at

    now = time.time()
    if _cached_rate and (now - _cached_at) < settings.exchange_rate_cache_ttl:
        return _cached_rate

    try:
        rate = _fetch_rate()
        _cached_rate = rate
        _cached_at = now
        return rate
    except Exception as exc:
        logger.warning(f"Failed to fetch exchange rate: {exc}, using default")
        if _cached_rate:
            return _cached_rate
        return DEFAULT_EUR_TWD_RATE


def _fetch_rate() -> float:
    """Fetch live EUR/TWD rate from API."""
    url = settings.exchange_rate_api_url
    if not url:
        return DEFAULT_EUR_TWD_RATE

    resp = httpx.get(url, timeout=10)
    resp.raise_for_status()
    data = resp.json()

    # exchangerate-api.com format
    rates = data.get("rates", {})
    twd_rate = rates.get("TWD")
    if twd_rate:
        return float(twd_rate)

    raise ValueError("TWD rate not found in API response")


async def get_eur_twd_rate_async() -> float:
    """Async version of exchange rate fetch."""
    global _cached_rate, _cached_at

    now = time.time()
    if _cached_rate and (now - _cached_at) < settings.exchange_rate_cache_ttl:
        return _cached_rate

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(settings.exchange_rate_api_url, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            rates = data.get("rates", {})
            twd_rate = rates.get("TWD")
            if twd_rate:
                _cached_rate = float(twd_rate)
                _cached_at = now
                return _cached_rate
    except Exception as exc:
        logger.warning(f"Async exchange rate fetch failed: {exc}")

    if _cached_rate:
        return _cached_rate
    return DEFAULT_EUR_TWD_RATE
