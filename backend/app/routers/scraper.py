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
    scrape_type: str = "delta"  # "full", "delta", "single", "availability"
    category: Optional[str] = None
    url: Optional[str] = None


class SingleScrapeRequest(BaseModel):
    url: str


class ScrapeStatusResponse(BaseModel):
    scheduler_running: bool
    jobs: list[dict]


@router.post("/run")
async def trigger_scrape(request: ScrapeRequest):
    """Manually trigger a scrape job."""
    from app.services.scrape_orchestrator import ScrapeOrchestrator

    if request.scrape_type == "full":
        async def _run_full():
            orchestrator = ScrapeOrchestrator()
            await orchestrator.run_full_scrape()

        asyncio.create_task(_run_full())
        return {"message": "Full scrape started", "type": "full"}

    elif request.scrape_type == "delta":
        async def _run_delta():
            orchestrator = ScrapeOrchestrator()
            await orchestrator.run_delta_scrape()

        asyncio.create_task(_run_delta())
        return {"message": "Delta scrape started", "type": "delta"}

    elif request.scrape_type == "availability":
        async def _run_availability():
            orchestrator = ScrapeOrchestrator()
            await orchestrator.run_availability_check()

        asyncio.create_task(_run_availability())
        return {"message": "Availability check started", "type": "availability"}

    elif request.scrape_type == "single" and request.url:
        from app.services.scrape_orchestrator import ScrapeOrchestrator

        orchestrator = ScrapeOrchestrator()
        try:
            result = await orchestrator.process_single_product(request.url)
            return {
                "message": "Single product processed",
                "type": "single",
                "result": {
                    "product_id": result["product_id"],
                    "status": result["status"],
                    "ai_confidence": result["ai_confidence"],
                    "images_processed": result["images_processed"],
                },
            }
        except Exception as exc:
            raise HTTPException(status_code=500, detail=str(exc))
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid scrape_type or missing URL for single scrape",
        )


@router.post("/run/single")
async def scrape_single_product(request: SingleScrapeRequest):
    """Scrape and fully process a single product URL."""
    from app.services.scrape_orchestrator import ScrapeOrchestrator

    orchestrator = ScrapeOrchestrator()
    try:
        result = await orchestrator.process_single_product(request.url)
        return result
    except Exception as exc:
        logger.error(f"Single product scrape failed: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


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
    source: Optional[str] = None,
    scrape_type: Optional[str] = None,
    db=Depends(get_db),
):
    """Get recent scrape logs with optional filters."""
    query = (
        db.table("scrape_logs")
        .select("*")
        .order("created_at", desc=True)
        .limit(limit)
    )
    if source:
        query = query.eq("source", source)
    if scrape_type:
        query = query.eq("scrape_type", scrape_type)

    result = query.execute()
    return result.data


@router.get("/stats")
async def get_scrape_stats(db=Depends(get_db)):
    """Get aggregate scraping statistics."""
    try:
        # Total products by status
        products_result = db.table("products").select("status").execute()
        status_counts: dict[str, int] = {}
        for row in products_result.data or []:
            s = row.get("status", "unknown")
            status_counts[s] = status_counts.get(s, 0) + 1

        # Recent scrape logs summary
        recent_logs = (
            db.table("scrape_logs")
            .select("*")
            .order("created_at", desc=True)
            .limit(10)
            .execute()
        )

        # Total dealers
        dealers_result = (
            db.table("dealers")
            .select("id", count="exact")
            .execute()
        )

        return {
            "products_by_status": status_counts,
            "total_products": sum(status_counts.values()),
            "total_dealers": dealers_result.count or 0,
            "recent_scrape_logs": recent_logs.data or [],
        }
    except Exception as exc:
        logger.error(f"Failed to fetch scrape stats: {exc}")
        raise HTTPException(status_code=500, detail="Failed to fetch stats")
