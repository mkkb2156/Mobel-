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
    from app.services.scrape_orchestrator import ScrapeOrchestrator

    logger.info("Starting full scrape job")
    try:
        orchestrator = ScrapeOrchestrator()
        stats = await orchestrator.run_full_scrape()
        logger.info(
            f"Full scrape complete: found={stats.products_found}, "
            f"new={stats.products_new}, errors={len(stats.errors)}"
        )
    except Exception as exc:
        logger.error(f"Full scrape job failed: {exc}")


async def delta_scrape_job() -> None:
    """Delta scrape: first 2 pages per category for new listings."""
    from app.services.scrape_orchestrator import ScrapeOrchestrator

    logger.info("Starting delta scrape job")
    try:
        orchestrator = ScrapeOrchestrator()
        stats = await orchestrator.run_delta_scrape()
        logger.info(
            f"Delta scrape complete: found={stats.products_found}, "
            f"new={stats.products_new}, errors={len(stats.errors)}"
        )
    except Exception as exc:
        logger.error(f"Delta scrape job failed: {exc}")


async def availability_check_job() -> None:
    """Check availability of products based on value tier."""
    from app.services.scrape_orchestrator import ScrapeOrchestrator

    logger.info("Starting availability check job")
    try:
        orchestrator = ScrapeOrchestrator()
        stats = await orchestrator.run_availability_check()
        logger.info(
            f"Availability check complete: checked={stats.products_found}, "
            f"delisted={stats.products_delisted}, errors={len(stats.errors)}"
        )
    except Exception as exc:
        logger.error(f"Availability check job failed: {exc}")


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
