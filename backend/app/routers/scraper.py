"""Scraper control and monitoring endpoints."""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from database import get_db
from app.services.scraper.scheduler import get_scheduler

logger = logging.getLogger(__name__)

router = APIRouter()


class ScrapeRequest(BaseModel):
    scrape_type: str = "delta"  # "full", "delta", "single"
    category: Optional[str] = None
    url: Optional[str] = None


class ScrapeStatusResponse(BaseModel):
    scheduler_running: bool
    jobs: list[dict]


@router.post("/run")
async def trigger_scrape(request: ScrapeRequest):
    """Manually trigger a scrape job."""
    from app.services.scraper.scheduler import full_scrape_job, delta_scrape_job

    if request.scrape_type == "full":
        asyncio.create_task(full_scrape_job())
        return {"message": "Full scrape started", "type": "full"}
    elif request.scrape_type == "delta":
        asyncio.create_task(delta_scrape_job())
        return {"message": "Delta scrape started", "type": "delta"}
    elif request.scrape_type == "single" and request.url:
        from app.services.scraper.vntg import VntgScraper

        scraper = VntgScraper()
        try:
            detail = await scraper.scrape_detail(request.url)
            return {
                "message": "Single product scraped",
                "product": {
                    "title": detail.title,
                    "price_eur": detail.price_eur,
                    "images": len(detail.images),
                    "source_url": detail.source_url,
                },
            }
        finally:
            await scraper.close()
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid scrape_type or missing URL for single scrape",
        )


@router.get("/status", response_model=ScrapeStatusResponse)
async def get_scraper_status():
    """Get scheduler status and job list."""
    scheduler = get_scheduler()
    if not scheduler:
        return ScrapeStatusResponse(scheduler_running=False, jobs=[])

    jobs = []
    for job in scheduler.get_jobs():
        jobs.append(
            {
                "id": job.id,
                "name": job.name,
                "next_run": str(job.next_run_time) if job.next_run_time else None,
            }
        )

    return ScrapeStatusResponse(scheduler_running=scheduler.running, jobs=jobs)


@router.get("/logs")
async def get_scrape_logs(
    limit: int = Query(50, ge=1, le=200),
    db=Depends(get_db),
):
    """Get recent scrape logs."""
    result = (
        db.table("scrape_logs")
        .select("*")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data
