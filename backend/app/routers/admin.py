"""Admin endpoints."""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from database import get_db
from app.services.product_service import ProductService

logger = logging.getLogger(__name__)

router = APIRouter()


class ProductApproval(BaseModel):
    status: str  # "approved" or "rejected"
    admin_notes: Optional[str] = None


class RejectRequest(BaseModel):
    reason: str


@router.get("/products/review-queue")
async def get_review_queue(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db=Depends(get_db),
):
    """Get products pending admin review."""
    service = ProductService(db)
    limit = page_size
    products = await service.get_review_queue(limit=limit)

    # Apply pagination offset manually since get_review_queue returns a flat list
    offset = (page - 1) * page_size
    paginated = products[offset : offset + page_size]
    return {
        "data": paginated,
        "page": page,
        "page_size": page_size,
        "total": len(products),
    }


@router.patch("/products/{product_id}/approve")
async def approve_product(
    product_id: str,
    approval: Optional[ProductApproval] = None,
    db=Depends(get_db),
):
    """Approve or reject a product (legacy endpoint supporting both actions)."""
    service = ProductService(db)

    if approval and approval.status == "rejected":
        reason = approval.admin_notes or "Rejected by admin"
        try:
            await service.reject_product(product_id, reason)
        except ValueError:
            raise HTTPException(status_code=404, detail="Product not found")
    else:
        try:
            await service.approve_product(product_id)
        except ValueError:
            raise HTTPException(status_code=404, detail="Product not found")

    # Return updated product
    result = (
        db.table("products")
        .select("*")
        .eq("id", product_id)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data[0]


@router.patch("/products/{product_id}/reject")
async def reject_product(
    product_id: str,
    body: RejectRequest,
    db=Depends(get_db),
):
    """Reject a product with a reason."""
    service = ProductService(db)
    try:
        await service.reject_product(product_id, body.reason)
    except ValueError:
        raise HTTPException(status_code=404, detail="Product not found")

    result = (
        db.table("products")
        .select("*")
        .eq("id", product_id)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data[0]


@router.get("/stats")
async def get_admin_stats(db=Depends(get_db)):
    """Get dashboard statistics with detailed breakdowns."""
    try:
        # Product counts by status
        products_result = db.table("products").select("status").execute()
        product_status_counts: dict[str, int] = {}
        for row in products_result.data or []:
            s = row.get("status", "unknown")
            product_status_counts[s] = product_status_counts.get(s, 0) + 1

        # Order counts
        orders = db.table("orders").select("status", count="exact").execute()

        # Inquiry counts
        inquiries = db.table("inquiries").select("status", count="exact").execute()

        # Dealer count
        dealers = db.table("dealers").select("id", count="exact").execute()

        # Recent scrape logs
        recent_scrapes = (
            db.table("scrape_logs")
            .select("*")
            .order("created_at", desc=True)
            .limit(5)
            .execute()
        )

        return {
            "products": {
                "total": sum(product_status_counts.values()),
                "by_status": product_status_counts,
            },
            "orders": {
                "total": orders.count or 0,
            },
            "inquiries": {
                "total": inquiries.count or 0,
            },
            "dealers": {
                "total": dealers.count or 0,
            },
            "recent_scrapes": recent_scrapes.data or [],
        }
    except Exception as exc:
        logger.error(f"Failed to fetch admin stats: {exc}")
        raise HTTPException(status_code=500, detail="Failed to fetch statistics")
