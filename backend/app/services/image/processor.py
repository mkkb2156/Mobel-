"""Image processing: download, WebP conversion, thumbnail generation."""

from __future__ import annotations

import io
import logging
from dataclasses import dataclass
from typing import List, Optional

import httpx
from PIL import Image

from database import get_supabase_client

logger = logging.getLogger(__name__)

# Size definitions: (max_width, suffix)
IMAGE_SIZES = [
    (None, "original"),    # Keep original dimensions
    (800, "medium"),       # 800px wide
    (400, "thumbnail"),    # 400px wide
]

STORAGE_BUCKET = "product-images"


@dataclass
class ProcessedImage:
    original_url: str
    storage_paths: dict  # {"original": "...", "medium": "...", "thumbnail": "..."}


async def download_image(url: str) -> Optional[bytes]:
    """Download an image from a URL."""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=30, follow_redirects=True)
            resp.raise_for_status()
            content_type = resp.headers.get("content-type", "")
            if "image" not in content_type and len(resp.content) < 100:
                logger.warning(f"Response from {url} does not appear to be an image")
                return None
            return resp.content
    except Exception as exc:
        logger.error(f"Failed to download image {url}: {exc}")
        return None


def convert_to_webp(
    image_bytes: bytes,
    max_width: Optional[int] = None,
    quality: int = 85,
) -> bytes:
    """Convert image bytes to WebP format, optionally resizing."""
    img = Image.open(io.BytesIO(image_bytes))

    # Convert RGBA to RGB if needed (WebP supports RGBA but we standardize)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGBA")
    elif img.mode != "RGB":
        img = img.convert("RGB")

    # Resize if max_width specified
    if max_width and img.width > max_width:
        ratio = max_width / img.width
        new_height = int(img.height * ratio)
        img = img.resize((max_width, new_height), Image.LANCZOS)

    output = io.BytesIO()
    img.save(output, format="WEBP", quality=quality)
    return output.getvalue()


async def process_product_images(
    image_urls: List[str],
    product_id: str,
) -> List[ProcessedImage]:
    """Download, convert, and upload all images for a product.

    Generates 3 sizes: original, medium (800px), thumbnail (400px).
    Uploads to Supabase Storage and returns the storage paths.
    """
    results: List[ProcessedImage] = []

    for idx, url in enumerate(image_urls):
        raw_bytes = await download_image(url)
        if not raw_bytes:
            continue

        storage_paths: dict[str, str] = {}

        for max_width, size_name in IMAGE_SIZES:
            try:
                webp_bytes = convert_to_webp(raw_bytes, max_width=max_width)
                path = f"{product_id}/{idx:03d}_{size_name}.webp"

                # Upload to Supabase Storage
                try:
                    supabase = get_supabase_client()
                    supabase.storage.from_(STORAGE_BUCKET).upload(
                        path,
                        webp_bytes,
                        file_options={"content-type": "image/webp"},
                    )
                    storage_paths[size_name] = path
                except Exception as upload_exc:
                    logger.error(f"Upload failed for {path}: {upload_exc}")
                    storage_paths[size_name] = path  # Store path anyway

            except Exception as exc:
                logger.error(
                    f"Failed to convert image {url} to {size_name}: {exc}"
                )

        if storage_paths:
            results.append(
                ProcessedImage(original_url=url, storage_paths=storage_paths)
            )

    return results


def get_public_url(path: str) -> str:
    """Get the public URL for a storage path."""
    try:
        supabase = get_supabase_client()
        resp = supabase.storage.from_(STORAGE_BUCKET).get_public_url(path)
        return resp
    except Exception:
        return f"/storage/{STORAGE_BUCKET}/{path}"
