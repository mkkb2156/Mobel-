"""Application configuration using pydantic-settings."""

from __future__ import annotations

import json
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- Supabase ---
    supabase_url: str = ""
    supabase_service_key: str = ""

    # --- Anthropic ---
    anthropic_api_key: str = ""

    # --- Wise ---
    wise_api_key: str = ""
    wise_profile_id: str = ""

    # --- LINE ---
    line_channel_access_token: str = ""
    line_channel_secret: str = ""

    # --- Resend ---
    resend_api_key: str = ""

    # --- ECPay ---
    ecpay_merchant_id: str = ""
    ecpay_hash_key: str = ""
    ecpay_hash_iv: str = ""

    # --- Exchange Rate ---
    exchange_rate_api_url: str = "https://api.exchangerate-api.com/v4/latest/EUR"
    exchange_rate_cache_ttl: int = 3600  # seconds

    # --- Scraper ---
    scraper_rate_limit: int = 20  # requests per minute
    scraper_min_delay: float = 3.0
    scraper_max_delay: float = 6.0
    scraper_full_schedule_cron: str = "0 2 * * *"
    scraper_delta_schedule_cron: str = "0 */4 * * *"
    scraper_availability_schedule_cron: str = "0 */1 * * *"

    # --- App ---
    app_env: str = "development"
    app_debug: bool = False
    port: int = 8000
    railway_environment: str = ""
    cors_origins: str = '["http://localhost:3000","http://localhost:5173"]'

    @property
    def cors_origin_list(self) -> List[str]:
        try:
            return json.loads(self.cors_origins)
        except (json.JSONDecodeError, TypeError):
            return ["http://localhost:3000"]

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def is_railway(self) -> bool:
        return bool(self.railway_environment)


settings = Settings()
