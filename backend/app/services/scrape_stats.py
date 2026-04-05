"""Scrape run statistics."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class ScrapeStats:
    """Tracks statistics for a single scrape run."""

    run_type: str
    started_at: datetime = field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    status: str = "running"
    products_found: int = 0
    products_new: int = 0
    products_updated: int = 0
    products_delisted: int = 0
    errors: list = field(default_factory=list)

    def to_dict(self) -> dict:
        """Serialize to dict for JSON responses and DB logging."""
        return {
            "run_type": self.run_type,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "status": self.status,
            "products_found": self.products_found,
            "products_new": self.products_new,
            "products_updated": self.products_updated,
            "products_delisted": self.products_delisted,
            "errors": self.errors,
        }
