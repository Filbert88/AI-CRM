"""
Dashboard API Endpoints

Endpoints for the sales workspace dashboard.
"""
from typing import List
from fastapi import APIRouter, Depends, status
from app.models.schemas import LeadResponse, DashboardSummary, ActionItem
from app.repositories.lead_repo import LeadRepository, get_lead_repository


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "/leads",
    response_model=List[LeadResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all leads",
    description="Retrieve all leads sorted by score in descending order."
)
async def get_leads(
    lead_repository: LeadRepository = Depends(get_lead_repository)
) -> List[LeadResponse]:
    """
    Get all leads from the system, sorted by score.
    
    Leads are returned in descending order of their score,
    with the highest-priority leads appearing first.
    
    - **Returns**: List of all leads with their scoring details
    """
    return lead_repository.get_all_leads()


@router.get(
    "/summary",
    response_model=DashboardSummary,
    status_code=status.HTTP_200_OK,
    summary="Get dashboard summary",
    description="Get summary statistics including counts of Hot, Warm, and Cold leads."
)
async def get_summary(
    lead_repository: LeadRepository = Depends(get_lead_repository)
) -> DashboardSummary:
    """
    Get summary statistics for the dashboard.
    
    Returns counts of leads categorized by priority:
    - **Hot leads**: Score 70-100
    - **Warm leads**: Score 40-69
    - **Cold leads**: Score 0-39
    
    - **Returns**: Dashboard summary with lead counts
    """
    return lead_repository.get_summary()


@router.get(
    "/actions",
    response_model=List[ActionItem],
    status_code=status.HTTP_200_OK,
    summary="Get action items",
    description="Get suggested action items for sales representatives based on hot leads."
)
async def get_actions(
    lead_repository: LeadRepository = Depends(get_lead_repository)
) -> List[ActionItem]:
    """
    Get action items for the sales team.
    
    Generates actionable to-do items based on the top hot leads
    to help sales representatives prioritize their outreach.
    
    - **Returns**: List of action items for follow-up
    """
    return lead_repository.get_actions()
