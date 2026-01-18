"""
Lead Repository - Data Access Layer with Supabase

This module provides database operations for leads using Supabase.
"""
from typing import List, Optional
from supabase import Client
from app.models.schemas import (
    LeadInput, LeadResponse, ScoringResult, Priority, Stage,
    DashboardSummary, ActionItem
)
from app.core.database import get_supabase_client


class LeadRepository:
    """
    Repository for storing and retrieving leads from Supabase.
    
    This class implements the Repository pattern with Supabase as the data store.
    """
    
    TABLE_NAME = "leads"
    
    def __init__(self, client: Client):
        """Initialize the repository with a Supabase client."""
        self._client = client
    
    def get_all_leads(self) -> List[LeadResponse]:
        """
        Get all leads sorted by score in descending order.
        
        Returns:
            List of LeadResponse objects sorted by score (highest first)
        """
        response = self._client.table(self.TABLE_NAME)\
            .select("*")\
            .order("score", desc=True)\
            .execute()
        
        return [self._row_to_lead_response(row) for row in response.data]
    
    def get_summary(self) -> DashboardSummary:
        """
        Calculate dashboard summary statistics.
        
        Returns:
            DashboardSummary with counts of leads by priority
        """
        response = self._client.table(self.TABLE_NAME)\
            .select("priority")\
            .execute()
        
        leads = response.data
        hot_count = sum(1 for lead in leads if lead["priority"] == Priority.HOT.value)
        warm_count = sum(1 for lead in leads if lead["priority"] == Priority.WARM.value)
        cold_count = sum(1 for lead in leads if lead["priority"] == Priority.COLD.value)
        
        return DashboardSummary(
            total_leads=len(leads),
            hot_leads=hot_count,
            warm_leads=warm_count,
            cold_leads=cold_count
        )
    
    def get_actions(self) -> List[ActionItem]:
        """
        Generate action items for the top 3 hot leads.
        
        Returns:
            List of ActionItem objects for high-priority leads
        """
        # Get top 3 hot leads by score
        response = self._client.table(self.TABLE_NAME)\
            .select("*")\
            .eq("priority", Priority.HOT.value)\
            .order("score", desc=True)\
            .limit(3)\
            .execute()
        
        actions: List[ActionItem] = []
        for idx, lead in enumerate(response.data, start=1):
            actions.append(ActionItem(
                id=f"ACTION-{idx:03d}",
                action_text=f"Follow up with {lead['lead_id']} - High priority lead in {lead['industry']} sector (Score: {lead['score']})",
                is_done=False,
                lead_id=lead["lead_id"]
            ))
        
        # Add additional action suggestion
        if response.data:
            actions.append(ActionItem(
                id=f"ACTION-{len(response.data) + 1:03d}",
                action_text="Schedule weekly review meeting for hot leads pipeline",
                is_done=False,
                lead_id=response.data[0]["lead_id"]
            ))
        
        return actions
    
    def add_lead(self, lead: LeadResponse) -> LeadResponse:
        """
        Add a new lead to the database.
        
        Args:
            lead: LeadResponse object to add
            
        Returns:
            The added LeadResponse object
        """
        data = {
            "lead_id": lead.lead_id,
            "industry": lead.industry,
            "company_size": lead.company_size,
            "channel": lead.channel,
            "interaction_count": lead.interaction_count,
            "last_interaction_days_ago": lead.last_interaction_days_ago,
            "has_requested_pricing": lead.has_requested_pricing,
            "has_demo_request": lead.has_demo_request,
            "score": lead.score_details.score,
            "priority": lead.score_details.priority.value,
            "explanations": lead.score_details.explanations,
            "stage": lead.stage.value,
        }
        
        self._client.table(self.TABLE_NAME).insert(data).execute()
        return lead
    
    def get_lead_by_id(self, lead_id: str) -> Optional[LeadResponse]:
        """
        Get a lead by its ID.
        
        Args:
            lead_id: The lead ID to search for
            
        Returns:
            LeadResponse if found, None otherwise
        """
        response = self._client.table(self.TABLE_NAME)\
            .select("*")\
            .eq("lead_id", lead_id)\
            .limit(1)\
            .execute()
        
        if response.data:
            return self._row_to_lead_response(response.data[0])
        return None
    
    def _row_to_lead_response(self, row: dict) -> LeadResponse:
        """Convert a database row to a LeadResponse object."""
        return LeadResponse(
            lead_id=row["lead_id"],
            industry=row["industry"],
            company_size=row["company_size"],
            channel=row["channel"],
            interaction_count=row["interaction_count"],
            last_interaction_days_ago=row["last_interaction_days_ago"],
            has_requested_pricing=row["has_requested_pricing"],
            has_demo_request=row["has_demo_request"],
            stage=Stage(row.get("stage", "new")),
            score_details=ScoringResult(
                score=row["score"],
                priority=Priority(row["priority"]),
                explanations=row["explanations"] or []
            )
        )
    
    def update_stage(self, lead_id: str, stage: Stage) -> Optional[LeadResponse]:
        """
        Update the pipeline stage for a lead.
        """
        response = self._client.table(self.TABLE_NAME)\
            .update({"stage": stage.value})\
            .eq("lead_id", lead_id)\
            .execute()
        
        if response.data:
            return self._row_to_lead_response(response.data[0])
        return None


def get_lead_repository() -> LeadRepository:
    """
    Factory function for dependency injection.
    Returns a LeadRepository instance with Supabase client.
    """
    client = get_supabase_client()
    return LeadRepository(client)
