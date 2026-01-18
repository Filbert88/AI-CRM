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
    
    def get_all_leads(self, owner_id: str) -> List[LeadResponse]:
        """
        Get all leads sorted by score in descending order.
        
        Returns:
            List of LeadResponse objects sorted by score (highest first)
        """
        response = self._client.table(self.TABLE_NAME)\
            .select("*")\
            .eq("owner_id", owner_id)\
            .order("score", desc=True)\
            .execute()
        
        return [self._row_to_lead_response(row) for row in response.data]
    
    def get_summary(self, owner_id: str) -> DashboardSummary:
        """
        Calculate dashboard summary statistics.
        
        Returns:
            DashboardSummary with counts of leads by priority
        """
        response = self._client.table(self.TABLE_NAME)\
            .select("priority")\
            .eq("owner_id", owner_id)\
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
    
    def get_actions(self, owner_id: str) -> List[ActionItem]:
        """
        Generate action items for high-priority leads based on specific signals.
        
        Rules:
        1. Negotiation -> Follow up on contract
        2. Pricing Request -> Send pricing package
        3. Demo Request -> Schedule demo
        4. Stalled (>7 days) -> Re-engage
        5. Default -> High priority follow-up
        """
        # Get top 5 hot leads
        response = self._client.table(self.TABLE_NAME)\
            .select("*")\
            .eq("owner_id", owner_id)\
            .eq("priority", Priority.HOT.value)\
            .order("score", desc=True)\
            .limit(5)\
            .execute()
        
        actions: List[ActionItem] = []
        for idx, lead_data in enumerate(response.data, start=1):
            lead = self._row_to_lead_response(lead_data)
            action_text = ""
            
            if lead.stage == Stage.NEGOTIATION:
                action_text = f"Follow up on contract terms with {lead.industry} lead"
            elif lead.has_requested_pricing:
                action_text = f"Send customized pricing package to {lead.lead_id}"
            elif lead.has_demo_request and lead.stage == Stage.NEW:
                action_text = f"Schedule product demo with {lead.lead_id}"
            elif lead.last_interaction_days_ago > 7:
                action_text = f"Re-engage {lead.lead_id} - no contact for {lead.last_interaction_days_ago} days"
            else:
                action_text = f"High priority follow-up with {lead.lead_id} (Score: {lead.score_details.score})"
            
            actions.append(ActionItem(
                id=f"ACTION-{idx:03d}",
                action_text=action_text,
                is_done=False,
                lead_id=lead.lead_id
            ))
            
            if len(actions) >= 5:
                break
        
        actions.append(ActionItem(
            id=f"ACTION-{len(actions) + 1:03d}",
            action_text="Schedule weekly review meeting for hot leads pipeline",
            is_done=False,
            lead_id="SYSTEM"
        ))
        
        return actions
    
    def add_lead(self, lead: LeadResponse, owner_id: str) -> LeadResponse:
        """
        Add a new lead to the database.
        
        Args:
            lead: LeadResponse object to add
            owner_id: ID of the user adding the lead
            
        Returns:
            The added LeadResponse object
        """
        data = {
            "owner_id": owner_id,
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
    
    def get_lead_by_id(self, lead_id: str, owner_id: str) -> Optional[LeadResponse]:
        """
        Get a lead by its ID and owner.
        
        Args:
            lead_id: The lead ID to search for
            owner_id: The owner ID
            
        Returns:
            LeadResponse if found, None otherwise
        """
        response = self._client.table(self.TABLE_NAME)\
            .select("*")\
            .eq("lead_id", lead_id)\
            .eq("owner_id", owner_id)\
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
    
    def update_stage(self, lead_id: str, stage: Stage, owner_id: str) -> Optional[LeadResponse]:
        """
        Update the pipeline stage for a lead.
        """
        response = self._client.table(self.TABLE_NAME)\
            .update({"stage": stage.value})\
            .eq("lead_id", lead_id)\
            .eq("owner_id", owner_id)\
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
