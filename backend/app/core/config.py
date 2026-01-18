"""
Application configuration settings.
"""
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    """Application settings using pydantic-settings."""
    
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "AI CRM Lead Scoring API"
    
    # Supabase Settings
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # CORS Settings
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    class Config:
        case_sensitive = True
        env_file = ".env"


# Global settings instance
settings = Settings()

