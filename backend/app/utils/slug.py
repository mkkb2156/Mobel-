"""Slug generation utility for products."""

from __future__ import annotations

from app.utils.helpers import slugify


def generate_slug(title: str, source_id: str) -> str:
    """Generate URL-friendly slug from product title.

    Transliterates, lowercases, replaces spaces with hyphens,
    and appends a short source_id suffix for uniqueness.
    Max 80 characters.
    """
    base = slugify(title)
    # Take last 8 chars of source_id as suffix
    suffix = source_id[-8:] if len(source_id) > 8 else source_id
    suffix = slugify(suffix)

    # Reserve space for suffix + hyphen
    max_base = 80 - len(suffix) - 1
    if max_base < 1:
        max_base = 40
    base = base[:max_base].rstrip("-")

    slug = f"{base}-{suffix}" if base else suffix
    return slug[:80]
