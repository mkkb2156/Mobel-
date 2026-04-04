"""LINE Messaging integration."""

from __future__ import annotations

import logging
from typing import Optional

import httpx

from config import settings

logger = logging.getLogger(__name__)

LINE_API_BASE = "https://api.line.me/v2/bot"


async def send_push_message(user_id: str, text: str) -> bool:
    """Send a push message to a LINE user."""
    if not settings.line_channel_access_token:
        logger.warning("LINE channel access token not configured")
        return False

    headers = {
        "Authorization": f"Bearer {settings.line_channel_access_token}",
        "Content-Type": "application/json",
    }
    payload = {
        "to": user_id,
        "messages": [{"type": "text", "text": text}],
    }

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{LINE_API_BASE}/message/push",
                json=payload,
                headers=headers,
                timeout=10,
            )
            resp.raise_for_status()
            return True
    except Exception as exc:
        logger.error(f"Failed to send LINE message: {exc}")
        return False


async def send_order_update(
    user_id: str,
    order_number: str,
    status: str,
    message: Optional[str] = None,
) -> bool:
    """Send an order status update via LINE."""
    text = f"MOBEL 訂單更新\n訂單編號: {order_number}\n狀態: {status}"
    if message:
        text += f"\n{message}"
    return await send_push_message(user_id, text)
