"""Abstract base class for scrapers."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import AsyncGenerator, List, Optional

from app.services.scraper.models import ProductDetail, RawProduct


class AbstractScraper(ABC):
    """Base class all site scrapers must implement."""

    @property
    @abstractmethod
    def source_name(self) -> str:
        """Human-readable source name, e.g. 'VNTG'."""
        ...

    @property
    @abstractmethod
    def base_url(self) -> str:
        """Site base URL."""
        ...

    @abstractmethod
    async def scrape_listings(
        self,
        category: str,
        *,
        max_pages: Optional[int] = None,
    ) -> AsyncGenerator[RawProduct, None]:
        """Yield raw product stubs from listing pages."""
        ...

    @abstractmethod
    async def scrape_detail(self, url: str) -> ProductDetail:
        """Scrape full detail for a single product."""
        ...

    @abstractmethod
    async def check_availability(self, url: str) -> bool:
        """Return True if the product page is still live / in stock."""
        ...

    @abstractmethod
    async def close(self) -> None:
        """Cleanup browser / session resources."""
        ...
