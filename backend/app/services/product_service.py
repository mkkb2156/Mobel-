"""Product lifecycle service -- bridges scraper/AI outputs to the database."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Optional

from supabase import Client

from app.services.scraper.models import ProductDetail, RawProduct
from app.services.ai.pipeline import run_pipeline
from app.services.image.processor import process_product_images
from app.services.price_history_service import record_price
from app.utils.slug import generate_slug

logger = logging.getLogger(__name__)


class ProductService:
    """Manages the full product lifecycle in the database."""

    def __init__(self, db: Client):
        self.db = db

    # ------------------------------------------------------------------
    # Upsert from scraper
    # ------------------------------------------------------------------
    async def upsert_from_scraper(
        self, raw: RawProduct, detail: ProductDetail, dealer_id: Optional[str] = None
    ) -> str:
        """Insert or update a product from scraped data. Returns product ID."""
        now = datetime.now(timezone.utc).isoformat()

        # Check if product already exists by source + source_id
        existing = (
            self.db.table("products")
            .select("id")
            .eq("source", "vntg")
            .eq("source_id", detail.source_id)
            .limit(1)
            .execute()
        )

        product_data = {
            "source_url": detail.source_url,
            "source_id": detail.source_id,
            "source": "vntg",
            "title_original": detail.title,
            "description_original": detail.description or "",
            "condition_original": detail.condition,
            "price_eur": detail.price_eur,
            "price_on_request": detail.price_on_request,
            "images": detail.images,
            "thumbnail": detail.images[0] if detail.images else None,
            "designer": detail.designer,
            "manufacturer": detail.manufacturer,
            "period": detail.period,
            "style": detail.style,
            "materials": detail.materials or [],
            "width_cm": detail.width_cm,
            "depth_cm": detail.depth_cm,
            "height_cm": detail.height_cm,
            "last_scraped_at": now,
        }

        if dealer_id:
            product_data["dealer_id"] = dealer_id

        if existing.data:
            # Update existing product
            product_id = existing.data[0]["id"]
            product_data["updated_at"] = now
            self.db.table("products").update(product_data).eq("id", product_id).execute()
            logger.info(f"Updated product {product_id} ({detail.source_id})")
            return product_id
        else:
            # Insert new product
            slug = generate_slug(detail.title, detail.source_id)
            product_data["slug"] = slug
            product_data["status"] = "pending"
            result = self.db.table("products").insert(product_data).execute()
            product_id = result.data[0]["id"]
            logger.info(f"Inserted new product {product_id} ({detail.source_id})")
            return product_id

    # ------------------------------------------------------------------
    # AI pipeline processing
    # ------------------------------------------------------------------
    async def process_with_ai(self, product_id: str) -> bool:
        """Run AI pipeline on a product and update DB with results."""
        # Fetch product from DB
        result = (
            self.db.table("products")
            .select("*")
            .eq("id", product_id)
            .limit(1)
            .execute()
        )
        if not result.data:
            logger.error(f"Product {product_id} not found in DB")
            return False

        row = result.data[0]

        # Build ProductDetail from DB record
        product_detail = ProductDetail(
            source_url=row["source_url"],
            source_id=row["source_id"],
            title=row["title_original"],
            description=row.get("description_original") or "",
            price_eur=row.get("price_eur"),
            price_on_request=row.get("price_on_request", False),
            images=row.get("images") or [],
            designer=row.get("designer"),
            manufacturer=row.get("manufacturer"),
            period=row.get("period"),
            condition=row.get("condition_original"),
            width_cm=row.get("width_cm"),
            depth_cm=row.get("depth_cm"),
            height_cm=row.get("height_cm"),
            materials=row.get("materials") or [],
            style=row.get("style"),
        )

        # Run the 6-stage pipeline
        try:
            pipeline_result = await run_pipeline(product_detail)
        except Exception as exc:
            logger.error(f"Pipeline failed for product {product_id}: {exc}")
            self.db.table("products").update({
                "status": "review_needed",
                "admin_notes": f"Pipeline error: {exc}",
            }).eq("id", product_id).execute()
            return False

        # Build update payload from pipeline results
        update_data: dict = {
            "ai_confidence": pipeline_result.overall_confidence,
        }

        # Translation
        if pipeline_result.translation:
            update_data["title_zh"] = pipeline_result.translation.title_zh
            update_data["description_zh"] = pipeline_result.translation.description_zh
            update_data["condition_zh"] = pipeline_result.translation.condition_zh

        # Classification
        if pipeline_result.classification:
            cls = pipeline_result.classification
            update_data["category"] = cls.category
            update_data["subcategory"] = cls.subcategory
            update_data["style"] = cls.style
            update_data["materials"] = cls.materials
            update_data["hs_code"] = cls.hs_code

        # Dimensions
        if pipeline_result.dimensions:
            dim = pipeline_result.dimensions
            update_data["width_cm"] = dim.width_cm
            update_data["depth_cm"] = dim.depth_cm
            update_data["height_cm"] = dim.height_cm
            update_data["volume_cbm"] = dim.volume_cbm
            update_data["dimension_method"] = dim.estimation_method

        # Pricing
        if pipeline_result.pricing:
            pr = pipeline_result.pricing.pricing
            update_data["exchange_rate"] = pr.exchange_rate
            update_data["base_twd"] = pr.base_twd
            update_data["markup_pct"] = pr.markup_pct
            update_data["markup_twd"] = pr.markup_twd
            update_data["shipping_twd"] = pr.international_shipping_twd
            update_data["customs_twd"] = pr.customs_duty_twd
            update_data["vat_twd"] = pr.vat_twd
            update_data["insurance_twd"] = pr.insurance_twd
            update_data["packaging_twd"] = pr.packaging_twd
            update_data["total_price_twd"] = pr.total_twd

            # Record price history
            if row.get("price_eur"):
                await record_price(
                    self.db,
                    product_id,
                    price_eur=row["price_eur"],
                    exchange_rate=pr.exchange_rate,
                    price_twd=pr.total_twd,
                )

        # Quality grading
        if pipeline_result.grading:
            update_data["quality_grade"] = pipeline_result.grading.grade

        # Embedding
        if pipeline_result.embedding:
            update_data["embedding"] = pipeline_result.embedding.embedding

        # Status based on quality gate
        if pipeline_result.passed_quality_gate:
            update_data["status"] = "approved"
        else:
            update_data["status"] = "review_needed"
            reasons = pipeline_result.errors or ["Low confidence score"]
            update_data["admin_notes"] = "; ".join(reasons)

        self.db.table("products").update(update_data).eq("id", product_id).execute()
        logger.info(
            f"AI processing complete for {product_id}: "
            f"status={update_data['status']}, confidence={pipeline_result.overall_confidence:.2f}"
        )
        return pipeline_result.passed_quality_gate

    # ------------------------------------------------------------------
    # Image processing
    # ------------------------------------------------------------------
    async def process_images(self, product_id: str) -> int:
        """Download and process all images for a product. Returns count."""
        result = (
            self.db.table("products")
            .select("images")
            .eq("id", product_id)
            .limit(1)
            .execute()
        )
        if not result.data:
            logger.error(f"Product {product_id} not found for image processing")
            return 0

        image_urls = result.data[0].get("images") or []
        if not image_urls:
            logger.info(f"No images to process for product {product_id}")
            return 0

        try:
            processed = await process_product_images(image_urls, product_id)
        except Exception as exc:
            logger.error(f"Image processing failed for {product_id}: {exc}")
            return 0

        if not processed:
            return 0

        # Extract storage paths by size
        thumbnails = []
        mediums = []
        originals = []
        for img in processed:
            paths = img.storage_paths
            if "thumbnail" in paths:
                thumbnails.append(paths["thumbnail"])
            if "medium" in paths:
                mediums.append(paths["medium"])
            if "original" in paths:
                originals.append(paths["original"])

        update_data: dict = {}
        if originals:
            update_data["images"] = originals
        if thumbnails:
            update_data["thumbnail"] = thumbnails[0]

        if update_data:
            self.db.table("products").update(update_data).eq("id", product_id).execute()

        logger.info(f"Processed {len(processed)} images for product {product_id}")
        return len(processed)

    # ------------------------------------------------------------------
    # Availability
    # ------------------------------------------------------------------
    async def update_availability(self, product_id: str, is_available: bool) -> None:
        """Update product availability status."""
        now = datetime.now(timezone.utc).isoformat()

        if is_available:
            self.db.table("products").update({
                "last_scraped_at": now,
            }).eq("id", product_id).execute()
        else:
            self.db.table("products").update({
                "status": "sold",
                "last_scraped_at": now,
            }).eq("id", product_id).execute()
            logger.info(f"Product {product_id} marked as sold/unavailable")

    # ------------------------------------------------------------------
    # Review queue
    # ------------------------------------------------------------------
    async def get_review_queue(self, limit: int = 50) -> list:
        """Get products needing manual review."""
        result = (
            self.db.table("products")
            .select("*")
            .in_("status", ["review_needed", "pending"])
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return result.data

    # ------------------------------------------------------------------
    # Approve / reject
    # ------------------------------------------------------------------
    async def approve_product(self, product_id: str) -> None:
        """Approve a product for listing."""
        now = datetime.now(timezone.utc).isoformat()
        result = (
            self.db.table("products")
            .update({"status": "approved", "updated_at": now})
            .eq("id", product_id)
            .execute()
        )
        if not result.data:
            raise ValueError(f"Product {product_id} not found")
        logger.info(f"Product {product_id} approved")

    async def reject_product(self, product_id: str, reason: str) -> None:
        """Reject a product."""
        now = datetime.now(timezone.utc).isoformat()
        result = (
            self.db.table("products")
            .update({
                "status": "rejected",
                "admin_notes": reason,
                "updated_at": now,
            })
            .eq("id", product_id)
            .execute()
        )
        if not result.data:
            raise ValueError(f"Product {product_id} not found")
        logger.info(f"Product {product_id} rejected: {reason}")
