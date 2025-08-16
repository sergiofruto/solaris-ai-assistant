from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Solaris AI Assistant"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/solaris_db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # AI Providers
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # CORS
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Load settings
settings = Settings()

# Override with environment variables if present
if os.getenv("OPENAI_API_KEY"):
    settings.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if os.getenv("GEMINI_API_KEY"):
    settings.GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if os.getenv("DATABASE_URL"):
    settings.DATABASE_URL = os.getenv("DATABASE_URL")

if os.getenv("REDIS_URL"):
    settings.REDIS_URL = os.getenv("REDIS_URL")
