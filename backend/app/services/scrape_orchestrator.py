"""Scrape orchestrator -- ties scraper + AI + images + DB together."""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone
from typing import Optional

from database import get_supabase_client
from app.services.product_service import ProductService
from app.services.dealer_service import DealerService
from app.services.scrape_stats import ScrapeStats
from app.services.scraper.vntg import VntgScraper, VNTG_CATEGORIES
from app.services.scraper.models import ProductDetail

logger = logging.getLogger(__name__)


class ScrapeOrchestrator:
    """Orchestrates the full scrape -> process -> store pipeline."""

    def __init__(self) -> None:
        self.db = get_supabase_client()
        self.product_service = ProductService(self.db)
        self.dealer_service = DealerService(self.db)

    # ------------------------------------------------------------------
    # Scrape log helpers
    # ------------------------------------------------------------------
    def _create_scrape_log(self, scrape_type: str, category: Optional[str] = None) -> str:
        """Create a scrape_logs entry and return its ID."""
        result = self.db.table("scrape_logs").insert({
            "source": "vntg",
            "scrape_type": scrape_type,
            "category": category,
            "status": "running",
        }).execute()
        return result.data[0]["id"]

    def _complete_scrape_log(
        self,
        log_id: str,
        stats: ScrapeStats,
        status: str = "completed",
    ) -> None:
        """Update the scrape_logs entry with final results."""
        now = datetime.now(timezone.utc)
        duration = (now - stats.started_at).total_seconds() if stats.started_at else 0

        self.db.table("scrape_logs").update({
            "status": status,
            "products_found": stats.products_found,
            "products_new": stats.products_new,
            "products_updated": stats.products_updated,
            "errors": len(stats.errors),
            "error_messages": stats.errors[:50],  # cap stored errors
            "duration_seconds": round(duration, 2),
            "completed_at": now.isoformat(),
        }).eq("id", log_id).execute()

    # ------------------------------------------------------------------
    # Full scrape
    # ------------------------------------------------------------------
    async def run_full_scrape(self) -> ScrapeStats:
        """Full scrape: all categories, all pages. Logs to scrape_logs."""
        stats = ScrapeStats(run_type="full")
        log_id = self._create_scrape_log("full")

        scraper = VntgScraper()
        try:
            for category in VNTG_CATEGORIES:
                logger.info(f"Full scrape: starting category '{category}'")
                try:
                    await self._scrape_category(
                        scraper, category, stats, max_pages=None
                    )
                except Exception as exc:
                    msg = f"Category {category} failed: {exc}"
                    logger.error(msg)
                    stats.errors.append(msg)

            stats.status = "completed"
            stats.completed_at = datetime.now(timezone.utc)
            self._complete_scrape_log(log_id, stats, status="completed")
        except Exception as exc:
            stats.status = "failed"
            stats.errors.append(f"Full scrape failed: {exc}")
            stats.completed_at = datetime.now(timezone.utc)
            self._complete_scrape_log(log_id, stats, status="failed")
            logger.error(f"Full scrape failed: {exc}")
        finally:
            await scraper.close()

        logger.info(
            f"Full scrape complete: found={stats.products_found}, "
            f"new={stats.products_new}, updated={stats.products_updated}, "
            f"errors={len(stats.errors)}"
        )
        return stats

    # ------------------------------------------------------------------
    # Delta scrape
    # ------------------------------------------------------------------
    async def run_delta_scrape(self) -> ScrapeStats:
        """Delta scrape: first 2 pages per category for new listings."""
        stats = ScrapeStats(run_type="delta")
        log_id = self._create_scrape_log("delta")

        scraper = VntgScraper()
        try:
            for category in VNTG_CATEGORIES:
                logger.info(f"Delta scrape: starting category '{category}'")
                try:
                    await self._scrape_category(
                        scraper, category, stats, max_pages=2, skip_existing=True
                    )
                except Exception as exc:
                    msg = f"Category {category} failed: {exc}"
                    logger.error(msg)
                    stats.errors.append(msg)

            stats.status = "completed"
            stats.completed_at = datetime.now(timezone.utc)
            self._complete_scrape_log(log_id, stats, status="completed")
        except Exception as exc:
            stats.status = "failed"
            stats.errors.append(f"Delta scrape failed: {exc}")
            stats.completed_at = datetime.now(timezone.utc)
            self._complete_scrape_log(log_id, stats, status="failed")
            logger.error(f"Delta scrape failed: {exc}")
        finally:
            await scraper.close()

        logger.info(
            f"Delta scrape complete: found={stats.products_found}, "
            f"new={stats.products_new}, updated={stats.products_updated}, "
            f"errors={len(stats.errors)}"
        )
        return stats

    # ------------------------------------------------------------------
    # Availability check
    # ------------------------------------------------------------------
    async def run_availability_check(self) -> ScrapeStats:
        """Check availability of products based on value tier.

        Tiers:
          high_value (>2000 EUR): check if last check > 4h ago
          medium_value (500-2000): check if last check > 12h ago
          low_value (<500): check if last check > 24h ago
        """
        stats = ScrapeStats(run_type="availability")
        log_id = self._create_scrape_log("availability")

        scraper = VntgScraper()
        try:
            now = datetime.now(timezone.utc)

            # Fetch approved products that need availability checks
            # We query all approved products and filter by tier in Python
            result = (
                self.db.table("products")
                .select("id, source_url, price_eur, last_scraped_at")
                .in_("status", ["approved", "pending"])
                .order("last_scraped_at", desc=False)
                .limit(200)
                .execute()
            )

            products_to_check = []
            for row in result.data or []:
                price = row.get("price_eur") or 0
                last_check = row.get("last_scraped_at")

                if last_check:
                    try:
                        last_dt = datetime.fromisoformat(
                            last_check.replace("Z", "+00:00")
                        )
                    except (ValueError, TypeError):
                        last_dt = None
                else:
                    last_dt = None

                # Determine interval based on price tier
                if price > 2000:
                    interval_hours = 4
                elif price >= 500:
                    interval_hours = 12
                else:
                    interval_hours = 24

                # Check if due
                if last_dt is None:
                    products_to_check.append(row)
                else:
                    elapsed_hours = (now - last_dt).total_seconds() / 3600
                    if elapsed_hours >= interval_hours:
                        products_to_check.append(row)

            logger.info(
                f"Availability check: {len(products_to_check)} products due for check"
            )

            for row in products_to_check:
                stats.products_found += 1
                try:
                    is_available = await scraper.check_availability(row["source_url"])
                    await self.product_service.update_availability(
                        row["id"], is_available
                    )
                    if not is_available:
                        stats.products_delisted += 1
                except Exception as exc:
                    msg = f"Availability check failed for {row['id']}: {exc}"
                    logger.error(msg)
                    stats.errors.append(msg)

            stats.status = "completed"
            stats.completed_at = datetime.now(timezone.utc)
            self._complete_scrape_log(log_id, stats, status="completed")
        except Exception as exc:
            stats.status = "failed"
            stats.errors.append(f"Availability check failed: {exc}")
            stats.completed_at = datetime.now(timezone.utc)
            self._complete_scrape_log(log_id, stats, status="failed")
            logger.error(f"Availability check failed: {exc}")
        finally:
            await scraper.close()

        logger.info(
            f"Availability check complete: checked={stats.products_found}, "
            f"delisted={stats.products_delisted}, errors={len(stats.errors)}"
        )
        return stats

    # ------------------------------------------------------------------
    # Single product
    # ------------------------------------------------------------------
    async def process_single_product(self, url: str) -> dict:
        """Scrape and process a single product URL end-to-end."""
        log_id = self._create_scrape_log("single")
        stats = ScrapeStats(run_type="single")

        scraper = VntgScraper()
        try:
            # Scrape detail page
            detail = await scraper.scrape_detail(url)
            stats.products_found = 1

            # Upsert dealer if present
            dealer_id = None
            if detail.dealer:
                dealer_id = await self.dealer_service.upsert_from_scraper(detail.dealer)

            # Create a minimal RawProduct for the upsert interface
            from app.services.scraper.models import RawProduct

            raw = RawProduct(
                source_url=detail.source_url,
                source_id=detail.source_id,
                title=detail.title,
                price_eur=detail.price_eur,
                price_on_request=detail.price_on_request,
                thumbnail_url=detail.images[0] if detail.images else None,
                dealer_name=detail.dealer.name if detail.dealer else None,
            )

            # Upsert product
            product_id = await self.product_service.upsert_from_scraper(
                raw, detail, dealer_id=dealer_id
            )
            stats.products_new = 1

            # Process images
            image_count = await self.product_service.process_images(product_id)

            # Run AI pipeline
            ai_success = await self.product_service.process_with_ai(product_id)

            stats.status = "completed"
            stats.completed_at = datetime.now(timezone.utc)
            self._complete_scrape_log(log_id, stats, status="completed")

            # Fetch final product data
            final = (
                self.db.table("products")
                .select("*")
                .eq("id", product_id)
                .limit(1)
                .execute()
            )
            product_data = final.data[0] if final.data else {}

            return {
                "product_id": product_id,
                "status": product_data.get("status", "unknown"),
                "ai_confidence": product_data.get("ai_confidence"),
                "images_processed": image_count,
                "ai_success": ai_success,
                "product": product_data,
            }
        except Exception as exc:
            stats.status = "failed"
            stats.errors.append(str(exc))
            stats.completed_at = datetime.now(timezone.utc)
            self._complete_scrape_log(log_id, stats, status="failed")
            logger.error(f"Single product processing failed for {url}: {exc}")
            raise
        finally:
            await scraper.close()

    # ------------------------------------------------------------------
    # Internal: scrape a single category
    # ------------------------------------------------------------------
    async def _scrape_category(
        self,
        scraper: VntgScraper,
        category: str,
        stats: ScrapeStats,
        max_pages: Optional[int] = None,
        skip_existing: bool = False,
    ) -> None:
        """Scrape all listings in a category and process each one."""
        async for raw in scraper.scrape_listings(category, max_pages=max_pages):
            stats.products_found += 1

            try:
                # For delta scrape, check if product already exists
                if skip_existing:
                    existing = (
                        self.db.table("products")
                        .select("id")
                        .eq("source", "vntg")
                        .eq("source_id", raw.source_id)
                        .limit(1)
                        .execute()
                    )
                    if existing.data:
                        stats.products_updated += 1
                        logger.debug(
                            f"Skipping existing product {raw.source_id} (delta mode)"
                        )
                        continue

                # Scrape full detail page
                detail = await scraper.scrape_detail(raw.source_url)

                # Upsert dealer
                dealer_id = None
                if detail.dealer:
                    try:
                        dealer_id = await self.dealer_service.upsert_from_scraper(
                            detail.dealer
                        )
                    except Exception as exc:
                        logger.warning(f"Dealer upsert failed: {exc}")

                # Upsert product
                product_id = await self.product_service.upsert_from_scraper(
                    raw, detail, dealer_id=dealer_id
                )
                stats.products_new += 1

                # Process images (non-blocking errors)
                try:
                    await self.product_service.process_images(product_id)
                except Exception as exc:
                    logger.warning(f"Image processing failed for {product_id}: {exc}")

                # Run AI pipeline (non-blocking errors)
                try:
                    await self.product_service.process_with_ai(product_id)
                except Exception as exc:
                    logger.warning(f"AI pipeline failed for {product_id}: {exc}")

            except Exception as exc:
                msg = f"Failed to process {raw.source_id}: {exc}"
                logger.error(msg)
                stats.errors.append(msg)
