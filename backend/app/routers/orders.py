"""Order management endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from database import get_db
from app.models.order import OrderRead

router = APIRouter()


@router.get("/{order_id}", response_model=OrderRead)
async def get_order(order_id: str, db=Depends(get_db)):
    """Get order by ID."""
    result = (
        db.table("orders")
        .select("*")
        .eq("id", order_id)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Order not found")
    return result.data[0]


@router.get("", response_model=list[OrderRead])
async def list_user_orders(
    user_id: str,
    db=Depends(get_db),
):
    """List orders for a user."""
    result = (
        db.table("orders")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data
