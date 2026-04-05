"""Dealer management service."""

from __future__ import annotations

import logging
from typing import Optional

from supabase import Client

from app.services.scraper.models import ScrapedDealer
from app.utils.helpers import slugify

logger = logging.getLogger(__name__)


class DealerService:
    """Manages dealer records in the database."""

    def __init__(self, db: Client):
        self.db = db

    async def upsert_from_scraper(self, dealer: ScrapedDealer) -> str:
        """Insert or update a dealer from scraped data. Returns dealer ID."""
        # Generate a stable identifier from dealer name
        vntg_slug = slugify(dealer.name)

        # Try to find existing dealer by name (exact match)
        existing = (
            self.db.table("dealers")
            .select("id")
            .eq("source", "vntg")
            .eq("name", dealer.name)
            .limit(1)
            .execute()
        )

        dealer_data = {
            "name": dealer.name,
            "source": "vntg",
            "source_url": dealer.url,
            "location": dealer.location,
        }

        if dealer.rating is not None:
            dealer_data["rating"] = dealer.rating

        if existing.data:
            dealer_id = existing.data[0]["id"]
            self.db.table("dealers").update(dealer_data).eq("id", dealer_id).execute()
            logger.debug(f"Updated dealer {dealer_id} ({dealer.name})")
            return dealer_id
        else:
            result = self.db.table("dealers").insert(dealer_data).execute()
            dealer_id = result.data[0]["id"]
            logger.info(f"Inserted new dealer {dealer_id} ({dealer.name})")
            return dealer_id

    async def update_reliability(self, dealer_id: str) -> None:
        """Recalculate dealer reliability score based on order history.

        Looks at completed orders linked to this dealer and computes
        a simple reliability rating from fulfillment success rate.
        """
        try:
            # Count total purchases for this dealer
            total_result = (
                self.db.table("purchases")
                .select("id", count="exact")
                .eq("dealer_id", dealer_id)
                .execute()
            )
            total = total_result.count or 0

            if total == 0:
                return

            # Count successful purchases (those with a purchased_at date)
            success_result = (
                self.db.table("purchases")
                .select("id", count="exact")
                .eq("dealer_id", dealer_id)
                .not_.is_("purchased_at", "null")
                .execute()
            )
            successful = success_result.count or 0

            # Rating on 0-5 scale
            reliability = round((successful / total) * 5, 2) if total > 0 else None

            self.db.table("dealers").update({
                "rating": reliability,
            }).eq("id", dealer_id).execute()

            logger.info(
                f"Updated dealer {dealer_id} reliability: "
                f"{successful}/{total} = {reliability}"
            )
        except Exception as exc:
            logger.error(f"Failed to update reliability for dealer {dealer_id}: {exc}")

    async def get_by_id(self, dealer_id: str) -> Optional[dict]:
        """Fetch a dealer by ID."""
        result = (
            self.db.table("dealers")
            .select("*")
            .eq("id", dealer_id)
            .limit(1)
            .execute()
        )
        return result.data[0] if result.data else None
