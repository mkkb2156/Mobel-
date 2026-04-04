"""Supabase client setup."""

from __future__ import annotations

from functools import lru_cache

from supabase import Client, create_client

from config import settings


@lru_cache(maxsize=1)
def get_supabase_client() -> Client:
    """Return a cached Supabase client instance (service-role)."""
    if not settings.supabase_url or not settings.supabase_service_key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment"
        )
    return create_client(settings.supabase_url, settings.supabase_service_key)


def get_db() -> Client:
    """Dependency for FastAPI route injection."""
    return get_supabase_client()
