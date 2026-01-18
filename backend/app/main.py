"""
AI CRM Lead Scoring API - Main Entry Point

FastAPI application with CORS middleware and API router configuration.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import router as api_v1_router


# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
    ## AI-Powered CRM Lead Scoring API
    
    This API provides intelligent lead scoring capabilities for sales teams.
    
    ### Features:
    - **Rule-based Lead Scoring**: Score leads based on engagement, recency, and intent signals
    - **Priority Classification**: Automatically classify leads as Hot, Warm, or Cold
    - **Dashboard Analytics**: Get summary statistics and actionable insights
    - **Action Items**: Generate follow-up tasks for sales representatives
    
    ### Scoring Logic:
    | Signal | Points |
    |--------|--------|
    | Engagement (per interaction) | +5 (max 25) |
    | Recent interaction (≤7 days) | +20 |
    | Pricing request | +30 |
    | Demo request | +15 |
    | Large company (>50 employees) | +10 |
    
    ### Priority Thresholds:
    - **Hot**: 70-100 points
    - **Warm**: 40-69 points  
    - **Cold**: 0-39 points
    """,
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.get(
    "/",
    tags=["Health"],
    summary="Health Check",
    description="Check if the API is running."
)
async def root():
    """
    Root endpoint for health checking.
    
    Returns a simple message confirming the API is operational.
    """
    return {"message": "AI CRM API is running"}


@app.get(
    "/health",
    tags=["Health"],
    summary="Detailed Health Check",
    description="Get detailed health status of the API."
)
async def health_check():
    """
    Detailed health check endpoint.
    
    Returns API status and version information.
    """
    return {
        "status": "healthy",
        "version": "1.0.0",
        "api_prefix": settings.API_V1_STR,
        "project_name": settings.PROJECT_NAME
    }
