"""Admin endpoints."""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from database import get_db

router = APIRouter()


class ProductApproval(BaseModel):
    status: str  # "approved" or "rejected"
    admin_notes: Optional[str] = None


@router.get("/products/review-queue")
async def get_review_queue(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db=Depends(get_db),
):
    """Get products pending admin review."""
    offset = (page - 1) * page_size
    result = (
        db.table("products")
        .select("*")
        .eq("status", "pending")
        .order("created_at", desc=True)
        .range(offset, offset + page_size - 1)
        .execute()
    )
    return result.data


@router.patch("/products/{product_id}/approve")
async def approve_product(
    product_id: str,
    approval: ProductApproval,
    db=Depends(get_db),
):
    """Approve or reject a product."""
    if approval.status not in ("approved", "rejected"):
        raise HTTPException(
            status_code=400,
            detail="Status must be 'approved' or 'rejected'",
        )

    update_data = {"status": approval.status}
    if approval.admin_notes:
        update_data["admin_notes"] = approval.admin_notes

    result = (
        db.table("products")
        .update(update_data)
        .eq("id", product_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data[0]


@router.get("/stats")
async def get_admin_stats(db=Depends(get_db)):
    """Get dashboard statistics."""
    products = db.table("products").select("status", count="exact").execute()
    orders = db.table("orders").select("status", count="exact").execute()
    inquiries = db.table("inquiries").select("status", count="exact").execute()

    return {
        "total_products": products.count or 0,
        "total_orders": orders.count or 0,
        "total_inquiries": inquiries.count or 0,
    }
