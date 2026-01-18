"""
Pydantic models (schemas) for data validation.
"""
from enum import Enum
from typing import List, Optional, Any
from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict, model_validator


class Priority(str, Enum):
    """Lead priority classification."""
    COLD = "Cold"
    WARM = "Warm"
    HOT = "Hot"


class Stage(str, Enum):
    """Sales pipeline stages."""
    NEW = "new"
    MEETING = "meeting"
    NEGOTIATION = "negotiation"
    CLOSED = "closed"


class LeadInput(BaseModel):
    """Input model for lead scoring."""
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "lead_id": "LEAD-001",
                "industry": "Technology",
                "company_size": 150,
                "channel": "Website",
                "interaction_count": 8,
                "last_interaction_days_ago": 3,
                "has_requested_pricing": True,
                "has_demo_request": False,
                "stage": "new"
            }
        }
    )
    
    lead_id: str = Field(..., description="Unique identifier for the lead")
    industry: str = Field(..., description="Industry of the lead's company")
    company_size: int = Field(..., ge=1, description="Number of employees in the company")
    channel: str = Field(..., description="Acquisition channel (e.g., Website, Referral, LinkedIn)")
    interaction_count: int = Field(..., ge=0, description="Total number of interactions with the lead")
    last_interaction_days_ago: Optional[int] = Field(None, ge=0, description="Days since the last interaction")
    last_interaction_date: Optional[date] = Field(None, description="Date of the last interaction (YYYY-MM-DD)")
    has_requested_pricing: bool = Field(..., description="Whether the lead has requested pricing information")
    has_demo_request: bool = Field(..., description="Whether the lead has requested a demo")
    stage: Stage = Field(default=Stage.NEW, description="Pipeline stage")

    @model_validator(mode='before')
    @classmethod
    def calculate_days_ago(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if data.get('last_interaction_date') and data.get('last_interaction_days_ago') is None:
                try:
                    interaction_val = data['last_interaction_date']
                    if isinstance(interaction_val, str):
                        interaction_date = datetime.strptime(interaction_val, "%Y-%m-%d").date()
                    else:
                        interaction_date = interaction_val
                    
                    days_ago = (date.today() - interaction_date).days
                    data['last_interaction_days_ago'] = max(0, days_ago)
                except (ValueError, TypeError):
                    pass 
            
            if data.get('last_interaction_days_ago') is None and data.get('last_interaction_date') is None:
                 data['last_interaction_days_ago'] = 0
                 
        return data


class ScoringResult(BaseModel):
    """Result of lead scoring calculation."""
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "score": 75,
                "priority": "Hot",
                "explanations": [
                    "High engagement detected (+25)",
                    "Recent interaction (+20)",
                    "Requested pricing (+30)"
                ]
            }
        }
    )
    
    score: int = Field(..., ge=0, le=100, description="Lead score from 0 to 100")
    priority: Priority = Field(..., description="Priority classification based on score")
    explanations: List[str] = Field(default_factory=list, description="List of scoring explanations")


class LeadResponse(LeadInput):
    """Full lead response combining input data with scoring result."""
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "lead_id": "LEAD-001",
                "industry": "Technology",
                "company_size": 150,
                "channel": "Website",
                "interaction_count": 8,
                "last_interaction_days_ago": 3,
                "has_requested_pricing": True,
                "has_demo_request": False,
                "stage": "new",
                "score_details": {
                    "score": 75,
                    "priority": "Hot",
                    "explanations": [
                        "High engagement detected (+25)",
                        "Recent interaction (+20)",
                        "Requested pricing (+30)"
                    ]
                }
            }
        }
    )
    
    score_details: ScoringResult = Field(..., description="Scoring result details")


class DashboardSummary(BaseModel):
    """Summary statistics for the dashboard."""
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "total_leads": 20,
                "hot_leads": 5,
                "warm_leads": 8,
                "cold_leads": 7
            }
        }
    )
    
    total_leads: int = Field(..., ge=0, description="Total number of leads")
    hot_leads: int = Field(..., ge=0, description="Number of hot leads (score 70-100)")
    warm_leads: int = Field(..., ge=0, description="Number of warm leads (score 40-69)")
    cold_leads: int = Field(..., ge=0, description="Number of cold leads (score 0-39)")


class ActionItem(BaseModel):
    """Action item for sales representatives."""
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "ACTION-001",
                "action_text": "Follow up with LEAD-001 - High priority lead in Technology sector",
                "is_done": False,
                "lead_id": "LEAD-001"
            }
        }
    )
    
    id: str = Field(..., description="Unique identifier for the action item")
    action_text: str = Field(..., description="Description of the action to take")
    is_done: bool = Field(default=False, description="Whether the action has been completed")
    lead_id: str = Field(..., description="Associated lead ID")


class StageUpdateRequest(BaseModel):
    """Request model for updating a lead's pipeline stage."""
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "stage": "meeting"
            }
        }
    )
    
    stage: Stage = Field(..., description="New pipeline stage")
