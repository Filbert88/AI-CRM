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

    # Auth Settings
    SECRET_KEY: str = "changethis-to-a-secure-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS Settings
    BACKEND_CORS_ORIGINS: list[str] = [
        "https://ai-crm-olj.vercel.app",
        "https://ai-crm-olj.vercel.app/",
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

