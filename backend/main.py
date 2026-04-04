"""MOBEL backend - FastAPI application entry point."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from app.routers import (
    admin,
    inquiries,
    orders,
    products,
    scraper,
    shipping,
    webhooks,
)
from app.services.scraper.scheduler import start_scheduler, shutdown_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    scheduler = start_scheduler()
    yield
    shutdown_scheduler(scheduler)


app = FastAPI(
    title="MOBEL API",
    description="European antique furniture proxy purchasing platform",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(inquiries.router, prefix="/api/inquiries", tags=["inquiries"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(scraper.router, prefix="/api/scraper", tags=["scraper"])
app.include_router(shipping.router, prefix="/api/shipping", tags=["shipping"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "mobel-api"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=settings.app_debug)
