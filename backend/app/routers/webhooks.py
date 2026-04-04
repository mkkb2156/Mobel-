"""Payment and LINE webhooks."""

from __future__ import annotations

import hashlib
import hmac
import logging
from typing import Any, Dict

from fastapi import APIRouter, Header, HTTPException, Request

from config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/ecpay")
async def ecpay_webhook(request: Request):
    """Handle ECPay payment notification callback."""
    form_data = await request.form()
    data = dict(form_data)
    logger.info(f"ECPay webhook received: MerchantTradeNo={data.get('MerchantTradeNo')}")

    # Verify CheckMacValue
    rtn_code = data.get("RtnCode")
    if rtn_code == "1":
        # Payment successful
        trade_no = data.get("MerchantTradeNo", "")
        # TODO: update order status to "paid"
        logger.info(f"Payment confirmed for trade: {trade_no}")
    else:
        logger.warning(f"Payment failed: RtnCode={rtn_code}")

    return "1|OK"


@router.post("/line")
async def line_webhook(
    request: Request,
    x_line_signature: str = Header(None, alias="X-Line-Signature"),
):
    """Handle LINE messaging webhook events."""
    body = await request.body()

    # Verify signature
    if settings.line_channel_secret and x_line_signature:
        expected = hmac.new(
            settings.line_channel_secret.encode("utf-8"),
            body,
            hashlib.sha256,
        ).digest()
        import base64

        expected_b64 = base64.b64encode(expected).decode("utf-8")
        if expected_b64 != x_line_signature:
            raise HTTPException(status_code=403, detail="Invalid signature")

    import json

    events = json.loads(body).get("events", [])
    for event in events:
        event_type = event.get("type")
        if event_type == "message":
            user_id = event.get("source", {}).get("userId")
            message = event.get("message", {})
            text = message.get("text", "")
            logger.info(f"LINE message from {user_id}: {text}")
            # TODO: route to chat handler
        elif event_type == "follow":
            user_id = event.get("source", {}).get("userId")
            logger.info(f"New LINE follower: {user_id}")

    return {"status": "ok"}
