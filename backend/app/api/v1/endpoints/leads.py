"""
Leads API Endpoints

Endpoints for lead scoring and lead creation.
"""
from fastapi import APIRouter, Depends, status
from app.models.schemas import LeadInput, ScoringResult, LeadResponse
from app.services.scoring_engine import LeadScoringService, get_scoring_service
from app.repositories.lead_repo import LeadRepository, get_lead_repository


router = APIRouter(prefix="/leads", tags=["Leads"])


@router.post(
    "/score",
    response_model=ScoringResult,
    status_code=status.HTTP_200_OK,
    summary="Score a lead (stateless)",
    description="Submit lead data and receive a scoring result. This endpoint does not save the lead."
)
async def score_lead(
    lead: LeadInput,
    scoring_service: LeadScoringService = Depends(get_scoring_service)
) -> ScoringResult:
    """
    Calculate the score for a lead without persisting it.
    
    This is useful for testing the scoring logic or previewing
    a lead's score before adding it to the system.
    
    - **lead**: Lead input data including engagement metrics and intent signals
    - **Returns**: Scoring result with score, priority, and explanations
    """
    return scoring_service.calculate_score(lead)


@router.post(
    "/",
    response_model=LeadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create and score a lead",
    description="Submit lead data, calculate its score, and save it to the system."
)
async def create_lead(
    lead: LeadInput,
    scoring_service: LeadScoringService = Depends(get_scoring_service),
    lead_repository: LeadRepository = Depends(get_lead_repository)
) -> LeadResponse:
    """
    Create a new lead, calculate its score, and persist it.
    
    The lead will be scored using the rule-based scoring engine
    and added to the lead repository for dashboard viewing.
    
    - **lead**: Lead input data including engagement metrics and intent signals
    - **Returns**: Full lead response with scoring details
    """
    # Calculate score
    score_result = scoring_service.calculate_score(lead)
    
    # Create full lead response
    lead_response = LeadResponse(
        **lead.model_dump(),
        score_details=score_result
    )
    
    # Persist to repository
    lead_repository.add_lead(lead_response)
    
    return lead_response
