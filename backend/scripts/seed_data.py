"""
Seed script to populate the leads table with initial data.

Run this script after creating the table to add sample leads:
    python -m scripts.seed_data
"""
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import get_supabase_client
from app.services.scoring_engine import LeadScoringService
from app.models.schemas import LeadInput


def seed_leads():
    """Seed the database with sample leads."""
    
    client = get_supabase_client()
    scoring_service = LeadScoringService()
    
    # Sample leads data (same as original mock data)
    mock_leads_data = [
        # Hot Leads (High engagement + intent signals)
        LeadInput(
            lead_id="LEAD-001",
            industry="Technology",
            company_size=250,
            channel="Website",
            interaction_count=10,
            last_interaction_days_ago=2,
            has_requested_pricing=True,
            has_demo_request=True
        ),
        LeadInput(
            lead_id="LEAD-002",
            industry="Finance",
            company_size=500,
            channel="LinkedIn",
            interaction_count=8,
            last_interaction_days_ago=1,
            has_requested_pricing=True,
            has_demo_request=False
        ),
        LeadInput(
            lead_id="LEAD-003",
            industry="Healthcare",
            company_size=120,
            channel="Referral",
            interaction_count=6,
            last_interaction_days_ago=3,
            has_requested_pricing=True,
            has_demo_request=True
        ),
        LeadInput(
            lead_id="LEAD-004",
            industry="E-commerce",
            company_size=80,
            channel="Website",
            interaction_count=7,
            last_interaction_days_ago=5,
            has_requested_pricing=True,
            has_demo_request=False
        ),
        LeadInput(
            lead_id="LEAD-005",
            industry="Manufacturing",
            company_size=300,
            channel="Trade Show",
            interaction_count=5,
            last_interaction_days_ago=4,
            has_requested_pricing=True,
            has_demo_request=True
        ),
        # Warm Leads (Moderate engagement)
        LeadInput(
            lead_id="LEAD-006",
            industry="Retail",
            company_size=45,
            channel="Website",
            interaction_count=4,
            last_interaction_days_ago=6,
            has_requested_pricing=False,
            has_demo_request=True
        ),
        LeadInput(
            lead_id="LEAD-007",
            industry="Education",
            company_size=200,
            channel="Email Campaign",
            interaction_count=3,
            last_interaction_days_ago=8,
            has_requested_pricing=True,
            has_demo_request=False
        ),
        LeadInput(
            lead_id="LEAD-008",
            industry="Consulting",
            company_size=25,
            channel="Referral",
            interaction_count=5,
            last_interaction_days_ago=10,
            has_requested_pricing=True,
            has_demo_request=False
        ),
        LeadInput(
            lead_id="LEAD-009",
            industry="Real Estate",
            company_size=60,
            channel="LinkedIn",
            interaction_count=4,
            last_interaction_days_ago=7,
            has_requested_pricing=False,
            has_demo_request=True
        ),
        LeadInput(
            lead_id="LEAD-010",
            industry="Logistics",
            company_size=150,
            channel="Website",
            interaction_count=3,
            last_interaction_days_ago=5,
            has_requested_pricing=False,
            has_demo_request=True
        ),
        LeadInput(
            lead_id="LEAD-011",
            industry="Media",
            company_size=75,
            channel="Social Media",
            interaction_count=6,
            last_interaction_days_ago=12,
            has_requested_pricing=False,
            has_demo_request=True
        ),
        LeadInput(
            lead_id="LEAD-012",
            industry="Insurance",
            company_size=400,
            channel="Cold Call",
            interaction_count=2,
            last_interaction_days_ago=3,
            has_requested_pricing=True,
            has_demo_request=False
        ),
        # Cold Leads (Low engagement)
        LeadInput(
            lead_id="LEAD-013",
            industry="Agriculture",
            company_size=30,
            channel="Website",
            interaction_count=1,
            last_interaction_days_ago=20,
            has_requested_pricing=False,
            has_demo_request=False
        ),
        LeadInput(
            lead_id="LEAD-014",
            industry="Construction",
            company_size=15,
            channel="Email Campaign",
            interaction_count=2,
            last_interaction_days_ago=30,
            has_requested_pricing=False,
            has_demo_request=False
        ),
        LeadInput(
            lead_id="LEAD-015",
            industry="Hospitality",
            company_size=40,
            channel="Trade Show",
            interaction_count=1,
            last_interaction_days_ago=45,
            has_requested_pricing=False,
            has_demo_request=False
        ),
        LeadInput(
            lead_id="LEAD-016",
            industry="Legal",
            company_size=10,
            channel="Referral",
            interaction_count=1,
            last_interaction_days_ago=60,
            has_requested_pricing=False,
            has_demo_request=False
        ),
        LeadInput(
            lead_id="LEAD-017",
            industry="Non-profit",
            company_size=20,
            channel="Website",
            interaction_count=2,
            last_interaction_days_ago=25,
            has_requested_pricing=False,
            has_demo_request=False
        ),
        LeadInput(
            lead_id="LEAD-018",
            industry="Transportation",
            company_size=55,
            channel="LinkedIn",
            interaction_count=1,
            last_interaction_days_ago=15,
            has_requested_pricing=False,
            has_demo_request=False
        ),
    ]
    
    print(f"Seeding {len(mock_leads_data)} leads...")
    
    for lead_input in mock_leads_data:
        # Calculate score
        score_result = scoring_service.calculate_score(lead_input)
        
        # Prepare data for insertion
        data = {
            "lead_id": lead_input.lead_id,
            "industry": lead_input.industry,
            "company_size": lead_input.company_size,
            "channel": lead_input.channel,
            "interaction_count": lead_input.interaction_count,
            "last_interaction_days_ago": lead_input.last_interaction_days_ago,
            "has_requested_pricing": lead_input.has_requested_pricing,
            "has_demo_request": lead_input.has_demo_request,
            "score": score_result.score,
            "priority": score_result.priority.value,
            "explanations": score_result.explanations,
        }
        
        try:
            client.table("leads").upsert(data, on_conflict="lead_id").execute()
            print(f"  ✓ {lead_input.lead_id}: Score={score_result.score}, Priority={score_result.priority.value}")
        except Exception as e:
            print(f"  ✗ {lead_input.lead_id}: Error - {e}")
    
    print("\nSeeding complete!")


if __name__ == "__main__":
    seed_leads()
