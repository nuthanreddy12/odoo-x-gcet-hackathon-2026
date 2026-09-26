import os
from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "StockSense Inventory Management"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "stocksense-super-secret-jwt-key-change-in-production-min-32-chars"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    # Database
    # Default to sqlite:///./stocksense.db if PostgreSQL/Supabase is not configured yet
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./stocksense.db")

    # Supabase optional configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    # CORS origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
