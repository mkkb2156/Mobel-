"""Price history recording service."""

from __future__ import annotations

import logging

from supabase import Client

logger = logging.getLogger(__name__)


async def record_price(
    db: Client,
    product_id: str,
    price_eur: float,
    exchange_rate: float,
    price_twd: float,
) -> None:
    """Record a price snapshot to the price_history table.

    Called whenever a product's price is set or changes so we maintain
    a full audit trail of pricing over time.
    """
    try:
        db.table("price_history").insert({
            "product_id": product_id,
            "price_eur": price_eur,
            "exchange_rate": exchange_rate,
            "total_price_twd": price_twd,
        }).execute()
        logger.debug(f"Recorded price history for product {product_id}: "
                      f"EUR {price_eur} / TWD {price_twd}")
    except Exception as exc:
        logger.error(f"Failed to record price history for {product_id}: {exc}")
