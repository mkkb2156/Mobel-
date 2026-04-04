"""VNTG.com scraper using Playwright."""

from __future__ import annotations

import asyncio
import logging
import random
import re
from typing import AsyncGenerator, Optional
from urllib.parse import urljoin

from playwright.async_api import Browser, Page, async_playwright

from config import settings
from app.services.scraper.base import AbstractScraper
from app.services.scraper.models import ProductDetail, RawProduct, ScrapedDealer

logger = logging.getLogger(__name__)

# VNTG category URL segments
VNTG_CATEGORIES = {
    "tables": "/en/tables",
    "chairs": "/en/chairs",
    "sofas": "/en/sofas",
    "storage": "/en/storage",
    "lighting": "/en/lighting",
    "desks": "/en/desks",
    "cabinets": "/en/cabinets",
    "sideboards": "/en/sideboards",
    "armchairs": "/en/armchairs",
    "shelving": "/en/shelving",
}


class VntgScraper(AbstractScraper):
    """Scraper for vntg.com vintage furniture marketplace."""

    def __init__(self) -> None:
        self._playwright = None
        self._browser: Optional[Browser] = None
        self._request_count = 0
        self._rate_window_start: Optional[float] = None

    @property
    def source_name(self) -> str:
        return "VNTG"

    @property
    def base_url(self) -> str:
        return "https://www.vntg.com"

    async def _ensure_browser(self) -> Browser:
        if self._browser is None:
            self._playwright = await async_playwright().start()
            self._browser = await self._playwright.chromium.launch(headless=True)
        return self._browser

    async def _new_page(self) -> Page:
        browser = await self._ensure_browser()
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 800},
            locale="en-US",
        )
        return await context.new_page()

    async def _rate_limit_delay(self) -> None:
        """Enforce rate limit: max N requests per minute with jitter."""
        now = asyncio.get_event_loop().time()
        if self._rate_window_start is None:
            self._rate_window_start = now
            self._request_count = 0

        self._request_count += 1

        if self._request_count >= settings.scraper_rate_limit:
            elapsed = now - self._rate_window_start
            if elapsed < 60:
                wait = 60 - elapsed + random.uniform(1, 3)
                logger.info(f"Rate limit reached, waiting {wait:.1f}s")
                await asyncio.sleep(wait)
            self._rate_window_start = asyncio.get_event_loop().time()
            self._request_count = 0

        delay = random.uniform(settings.scraper_min_delay, settings.scraper_max_delay)
        await asyncio.sleep(delay)

    def _parse_price(self, price_text: str) -> tuple[Optional[float], bool]:
        """Parse price text, returning (eur_amount, is_price_on_request)."""
        if not price_text:
            return None, True
        text = price_text.strip().lower()
        if "price on request" in text or "on request" in text:
            return None, True
        numbers = re.findall(r"[\d.,]+", text.replace(",", ""))
        if numbers:
            try:
                return float(numbers[0].replace(",", "")), False
            except ValueError:
                return None, True
        return None, True

    def _parse_dimension(self, text: str) -> Optional[float]:
        """Extract a numeric dimension value in cm from text."""
        if not text:
            return None
        match = re.search(r"([\d.]+)\s*cm", text, re.IGNORECASE)
        if match:
            return float(match.group(1))
        return None

    async def scrape_listings(
        self,
        category: str,
        *,
        max_pages: Optional[int] = None,
    ) -> AsyncGenerator[RawProduct, None]:
        """Scrape listing pages for a given category."""
        cat_path = VNTG_CATEGORIES.get(category, f"/en/{category}")
        page = await self._new_page()

        try:
            current_page = 1
            while True:
                if max_pages and current_page > max_pages:
                    break

                url = f"{self.base_url}{cat_path}?page={current_page}"
                logger.info(f"Scraping listings: {url}")

                await self._rate_limit_delay()
                await page.goto(url, wait_until="domcontentloaded", timeout=30_000)

                # Wait for product grid to load
                try:
                    await page.wait_for_selector(
                        ".product-card, .product-item, .item-card",
                        timeout=10_000,
                    )
                except Exception:
                    logger.info(f"No products found on page {current_page}, stopping")
                    break

                cards = await page.query_selector_all(
                    ".product-card, .product-item, .item-card"
                )
                if not cards:
                    break

                for card in cards:
                    try:
                        link_el = await card.query_selector("a[href]")
                        href = await link_el.get_attribute("href") if link_el else None
                        if not href:
                            continue

                        product_url = urljoin(self.base_url, href)
                        source_id = href.strip("/").split("/")[-1]

                        title_el = await card.query_selector(
                            ".product-card__title, .item-title, h3, h2"
                        )
                        title = (
                            (await title_el.inner_text()).strip()
                            if title_el
                            else "Unknown"
                        )

                        price_el = await card.query_selector(
                            ".product-card__price, .item-price, .price"
                        )
                        price_text = (
                            (await price_el.inner_text()).strip() if price_el else ""
                        )
                        price_eur, price_on_request = self._parse_price(price_text)

                        img_el = await card.query_selector("img")
                        thumb = (
                            await img_el.get_attribute("src") if img_el else None
                        )

                        dealer_el = await card.query_selector(
                            ".product-card__dealer, .dealer-name, .seller"
                        )
                        dealer_name = (
                            (await dealer_el.inner_text()).strip()
                            if dealer_el
                            else None
                        )

                        yield RawProduct(
                            source_url=product_url,
                            source_id=source_id,
                            title=title,
                            price_eur=price_eur,
                            price_on_request=price_on_request,
                            thumbnail_url=thumb,
                            dealer_name=dealer_name,
                            category=category,
                        )
                    except Exception as exc:
                        logger.warning(f"Failed to parse listing card: {exc}")
                        continue

                # Check for next page
                next_btn = await page.query_selector(
                    'a.next, a[rel="next"], .pagination__next'
                )
                if not next_btn:
                    break
                is_disabled = await next_btn.get_attribute("disabled")
                if is_disabled:
                    break

                current_page += 1
        finally:
            await page.context.close()

    async def scrape_detail(self, url: str) -> ProductDetail:
        """Scrape full product detail page."""
        page = await self._new_page()
        try:
            await self._rate_limit_delay()
            await page.goto(url, wait_until="domcontentloaded", timeout=30_000)

            source_id = url.strip("/").split("/")[-1]

            # Title
            title_el = await page.query_selector(
                "h1.product__title, h1.product-title, h1"
            )
            title = (await title_el.inner_text()).strip() if title_el else "Unknown"

            # Description
            desc_el = await page.query_selector(
                ".product__description, .product-description, "
                ".description-text, [data-description]"
            )
            description = (await desc_el.inner_text()).strip() if desc_el else ""

            # Price
            price_el = await page.query_selector(
                ".product__price, .product-price, .price--current"
            )
            price_text = (await price_el.inner_text()).strip() if price_el else ""
            price_eur, price_on_request = self._parse_price(price_text)

            # Images
            images = []
            img_elements = await page.query_selector_all(
                ".product__gallery img, .product-images img, "
                ".gallery img, .carousel img"
            )
            for img in img_elements:
                src = await img.get_attribute("src") or await img.get_attribute(
                    "data-src"
                )
                if src and src.startswith("http"):
                    images.append(src)

            # Specification table
            specs: dict[str, str] = {}
            spec_rows = await page.query_selector_all(
                ".product__specs tr, .specifications tr, "
                ".product-details tr, .product-attributes li"
            )
            for row in spec_rows:
                cells = await row.query_selector_all("td, th, span")
                if len(cells) >= 2:
                    key = (await cells[0].inner_text()).strip().lower()
                    val = (await cells[1].inner_text()).strip()
                    specs[key] = val

            designer = specs.get("designer") or specs.get("design")
            manufacturer = specs.get("manufacturer") or specs.get("maker")
            period = specs.get("period") or specs.get("year") or specs.get("decade")
            condition = specs.get("condition")
            style = specs.get("style")

            # Dimensions
            width_cm = self._parse_dimension(
                specs.get("width", specs.get("w", ""))
            )
            depth_cm = self._parse_dimension(
                specs.get("depth", specs.get("d", ""))
            )
            height_cm = self._parse_dimension(
                specs.get("height", specs.get("h", ""))
            )

            # Try combined dimension string e.g. "80 x 40 x 75 cm"
            dim_text = specs.get("dimensions", specs.get("size", ""))
            if dim_text and not all([width_cm, depth_cm, height_cm]):
                dim_matches = re.findall(r"([\d.]+)", dim_text)
                if len(dim_matches) >= 3:
                    width_cm = width_cm or float(dim_matches[0])
                    depth_cm = depth_cm or float(dim_matches[1])
                    height_cm = height_cm or float(dim_matches[2])

            # Materials
            materials_text = specs.get("material", specs.get("materials", ""))
            materials = (
                [m.strip() for m in re.split(r"[,/]", materials_text) if m.strip()]
                if materials_text
                else []
            )

            # Dealer info
            dealer = None
            dealer_el = await page.query_selector(
                ".dealer__name, .seller-name, .shop-name, "
                "[data-dealer-name]"
            )
            if dealer_el:
                dealer_name = (await dealer_el.inner_text()).strip()
                dealer_link_el = await page.query_selector(
                    ".dealer__link, .seller-link, a[href*='dealer'], a[href*='shop']"
                )
                dealer_url = None
                if dealer_link_el:
                    href = await dealer_link_el.get_attribute("href")
                    dealer_url = urljoin(self.base_url, href) if href else None

                dealer_loc_el = await page.query_selector(
                    ".dealer__location, .seller-location, .shop-location"
                )
                dealer_location = (
                    (await dealer_loc_el.inner_text()).strip()
                    if dealer_loc_el
                    else None
                )

                dealer = ScrapedDealer(
                    name=dealer_name,
                    url=dealer_url,
                    location=dealer_location,
                )

            return ProductDetail(
                source_url=url,
                source_id=source_id,
                title=title,
                description=description,
                price_eur=price_eur,
                price_on_request=price_on_request,
                images=images,
                designer=designer,
                manufacturer=manufacturer,
                period=period,
                condition=condition,
                width_cm=width_cm,
                depth_cm=depth_cm,
                height_cm=height_cm,
                materials=materials,
                style=style,
                dealer=dealer,
            )
        finally:
            await page.context.close()

    async def check_availability(self, url: str) -> bool:
        """Check if a product is still available."""
        page = await self._new_page()
        try:
            await self._rate_limit_delay()
            resp = await page.goto(url, wait_until="domcontentloaded", timeout=30_000)
            if resp and resp.status == 404:
                return False

            sold_indicator = await page.query_selector(
                ".sold-label, .product--sold, .badge--sold, "
                '[data-availability="sold"]'
            )
            if sold_indicator:
                return False

            return True
        except Exception:
            return False
        finally:
            await page.context.close()

    async def close(self) -> None:
        if self._browser:
            await self._browser.close()
        if self._playwright:
            await self._playwright.stop()
        self._browser = None
        self._playwright = None
