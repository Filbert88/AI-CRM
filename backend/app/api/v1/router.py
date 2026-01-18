"""
API v1 Router

Central router that includes all v1 endpoint routers.
"""
from fastapi import APIRouter
from app.api.v1.endpoints import leads, dashboard


router = APIRouter()

# Include endpoint routers
router.include_router(leads.router)
router.include_router(dashboard.router)
