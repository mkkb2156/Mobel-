"""Scrape scheduling with APScheduler."""

from __future__ import annotations

import logging
from typing import Optional

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from config import settings

logger = logging.getLogger(__name__)

_scheduler: Optional[AsyncIOScheduler] = None


async def full_scrape_job() -> None:
    """Full scrape: all categories, all pages."""
    from app.services.scraper.vntg import VntgScraper, VNTG_CATEGORIES

    logger.info("Starting full scrape job")
    scraper = VntgScraper()
    try:
        for category in VNTG_CATEGORIES:
            count = 0
            async for product in scraper.scrape_listings(category):
                count += 1
                # TODO: persist to DB, enqueue AI pipeline
            logger.info(f"Full scrape [{category}]: {count} products found")
    except Exception as exc:
        logger.error(f"Full scrape failed: {exc}")
    finally:
        await scraper.close()


async def delta_scrape_job() -> None:
    """Delta scrape: first 2 pages per category for new listings."""
    from app.services.scraper.vntg import VntgScraper, VNTG_CATEGORIES

    logger.info("Starting delta scrape job")
    scraper = VntgScraper()
    try:
        for category in VNTG_CATEGORIES:
            count = 0
            async for product in scraper.scrape_listings(category, max_pages=2):
                count += 1
                # TODO: check if already in DB, if not persist + enqueue
            logger.info(f"Delta scrape [{category}]: {count} products found")
    except Exception as exc:
        logger.error(f"Delta scrape failed: {exc}")
    finally:
        await scraper.close()


async def availability_check_job() -> None:
    """Check availability of all approved products."""
    logger.info("Starting availability check job")
    # TODO: query approved products from DB, check each URL
    logger.info("Availability check complete")


def _parse_cron(expr: str) -> CronTrigger:
    """Parse a standard cron expression into an APScheduler CronTrigger."""
    parts = expr.strip().split()
    if len(parts) != 5:
        raise ValueError(f"Invalid cron expression: {expr}")
    minute, hour, day, month, day_of_week = parts
    return CronTrigger(
        minute=minute,
        hour=hour,
        day=day,
        month=month,
        day_of_week=day_of_week,
    )


def start_scheduler() -> AsyncIOScheduler:
    """Create and start the APScheduler instance."""
    global _scheduler
    scheduler = AsyncIOScheduler()

    scheduler.add_job(
        full_scrape_job,
        trigger=_parse_cron(settings.scraper_full_schedule_cron),
        id="full_scrape",
        name="Full VNTG scrape",
        replace_existing=True,
    )
    scheduler.add_job(
        delta_scrape_job,
        trigger=_parse_cron(settings.scraper_delta_schedule_cron),
        id="delta_scrape",
        name="Delta VNTG scrape",
        replace_existing=True,
    )
    scheduler.add_job(
        availability_check_job,
        trigger=_parse_cron(settings.scraper_availability_schedule_cron),
        id="availability_check",
        name="Availability check",
        replace_existing=True,
    )

    scheduler.start()
    _scheduler = scheduler
    logger.info("Scheduler started with scrape jobs registered")
    return scheduler


def shutdown_scheduler(scheduler: AsyncIOScheduler) -> None:
    """Gracefully shut down the scheduler."""
    global _scheduler
    if scheduler and scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("Scheduler shut down")
    _scheduler = None


def get_scheduler() -> Optional[AsyncIOScheduler]:
    return _scheduler
