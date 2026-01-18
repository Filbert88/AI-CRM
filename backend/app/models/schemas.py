"""
Pydantic models (schemas) for data validation.
"""
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class Priority(str, Enum):
    """Lead priority classification."""
    COLD = "Cold"
    WARM = "Warm"
    HOT = "Hot"


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
                "has_demo_request": False
            }
        }
    )
    
    lead_id: str = Field(..., description="Unique identifier for the lead")
    industry: str = Field(..., description="Industry of the lead's company")
    company_size: int = Field(..., ge=1, description="Number of employees in the company")
    channel: str = Field(..., description="Acquisition channel (e.g., Website, Referral, LinkedIn)")
    interaction_count: int = Field(..., ge=0, description="Total number of interactions with the lead")
    last_interaction_days_ago: int = Field(..., ge=0, description="Days since the last interaction")
    has_requested_pricing: bool = Field(..., description="Whether the lead has requested pricing information")
    has_demo_request: bool = Field(..., description="Whether the lead has requested a demo")


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
