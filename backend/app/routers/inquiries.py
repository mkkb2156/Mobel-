"""Inquiry endpoints."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from database import get_db
from app.models.inquiry import InquiryCreate, InquiryRead
from app.services.notification.email import send_inquiry_confirmation

router = APIRouter()


@router.post("", response_model=InquiryRead, status_code=201)
async def create_inquiry(inquiry: InquiryCreate, db=Depends(get_db)):
    """Create a new inquiry."""
    data = inquiry.model_dump()
    data["status"] = "new"

    result = db.table("inquiries").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create inquiry")

    created = result.data[0]

    # Send confirmation email (fire and forget)
    try:
        await send_inquiry_confirmation(
            email=inquiry.email,
            name=inquiry.name,
            inquiry_id=created["id"],
        )
    except Exception:
        pass  # Non-critical

    return created


@router.get("/{inquiry_id}", response_model=InquiryRead)
async def get_inquiry(inquiry_id: str, db=Depends(get_db)):
    """Get inquiry by ID."""
    result = (
        db.table("inquiries")
        .select("*")
        .eq("id", inquiry_id)
        .limit(1)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return result.data[0]
