"""Product CRUD + search endpoints."""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from database import get_db
from app.models.product import (
    ProductListItem,
    ProductRead,
    ProductSearchQuery,
)

router = APIRouter()


@router.get("", response_model=list[ProductListItem])
async def list_products(
    category: Optional[str] = Query(None),
    style: Optional[str] = Query(None),
    designer: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    quality_grade: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(24, ge=1, le=100),
    db=Depends(get_db),
):
    """List products with filtering, sorting, and pagination."""
    query = db.table("products").select("*").eq("status", "approved")

    if category:
        query = query.eq("category", category)
    if style:
        query = query.eq("style", style)
    if designer:
        query = query.ilike("designer", f"%{designer}%")
    if min_price is not None:
        query = query.gte("total_price_twd", min_price)
    if max_price is not None:
        query = query.lte("total_price_twd", max_price)
    if quality_grade:
        query = query.eq("quality_grade", quality_grade)

    # Sorting
    ascending = sort_order.lower() == "asc"
    query = query.order(sort_by, desc=not ascending)

    # Pagination
    offset = (page - 1) * page_size
    query = query.range(offset, offset + page_size - 1)

    result = query.execute()
    return result.data


@router.get("/search", response_model=list[ProductListItem])
async def search_products(
    q: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    page_size: int = Query(24, ge=1, le=100),
    db=Depends(get_db),
):
    """Full-text search for products."""
    offset = (page - 1) * page_size

    # Use Supabase text search (requires full-text search index)
    result = (
        db.table("products")
        .select("*")
        .eq("status", "approved")
        .or_(
            f"title_original.ilike.%{q}%,"
            f"title_zh.ilike.%{q}%,"
            f"designer.ilike.%{q}%,"
            f"description_original.ilike.%{q}%"
        )
        .order("created_at", desc=True)
        .range(offset, offset + page_size - 1)
        .execute()
    )
    return result.data


@router.get("/{slug}", response_model=ProductRead)
async def get_product(slug: str, db=Depends(get_db)):
    """Get a single product by slug."""
    result = (
        db.table("products")
        .select("*")
        .eq("slug", slug)
        .eq("status", "approved")
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data[0]
