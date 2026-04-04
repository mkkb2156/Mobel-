"""Email notifications via Resend."""

from __future__ import annotations

import logging
from typing import Optional

import httpx

from config import settings

logger = logging.getLogger(__name__)

RESEND_API_URL = "https://api.resend.com/emails"
FROM_EMAIL = "MOBEL <noreply@mobel.tw>"


async def send_email(
    to: str,
    subject: str,
    html_body: str,
    text_body: Optional[str] = None,
) -> bool:
    """Send an email via Resend API."""
    if not settings.resend_api_key:
        logger.warning("Resend API key not configured")
        return False

    headers = {
        "Authorization": f"Bearer {settings.resend_api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "from": FROM_EMAIL,
        "to": [to],
        "subject": subject,
        "html": html_body,
    }
    if text_body:
        payload["text"] = text_body

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                RESEND_API_URL,
                json=payload,
                headers=headers,
                timeout=10,
            )
            resp.raise_for_status()
            return True
    except Exception as exc:
        logger.error(f"Failed to send email: {exc}")
        return False


async def send_inquiry_confirmation(email: str, name: str, inquiry_id: str) -> bool:
    """Send inquiry confirmation email."""
    subject = "MOBEL - 詢價確認 / Inquiry Confirmation"
    html = f"""
    <h2>感謝您的詢價 / Thank you for your inquiry</h2>
    <p>{name} 您好,</p>
    <p>我們已收到您的詢價 (編號: {inquiry_id})，將盡快回覆您。</p>
    <p>We have received your inquiry (ID: {inquiry_id}) and will respond shortly.</p>
    <br>
    <p>MOBEL - 歐洲古董家具代購</p>
    """
    return await send_email(email, subject, html)


async def send_order_confirmation(email: str, name: str, order_number: str) -> bool:
    """Send order confirmation email."""
    subject = f"MOBEL - 訂單確認 #{order_number}"
    html = f"""
    <h2>訂單確認 / Order Confirmation</h2>
    <p>{name} 您好,</p>
    <p>您的訂單 #{order_number} 已確認。</p>
    <p>Your order #{order_number} has been confirmed.</p>
    <br>
    <p>MOBEL - 歐洲古董家具代購</p>
    """
    return await send_email(email, subject, html)
