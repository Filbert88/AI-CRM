"""
API v1 Router

Central router that includes all v1 endpoint routers.
"""
from fastapi import APIRouter
from app.api.v1.endpoints import leads, dashboard, auth


router = APIRouter()

# Include endpoint routers
router.include_router(auth.router, prefix="/auth", tags=["Auth"])
router.include_router(leads.router)
router.include_router(dashboard.router)
