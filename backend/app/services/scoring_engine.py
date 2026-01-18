"""
Lead Scoring Service - Core Business Logic

This module implements rule-based lead scoring that is extensible for future ML integration.
"""
from app.models.schemas import LeadInput, ScoringResult, Priority


class LeadScoringService:
    """
    Service class for calculating lead scores based on engagement and intent signals.
    
    The scoring logic is designed to be extensible for future ML model integration.
    Current implementation uses rule-based scoring with the following criteria:
    - Engagement: Points based on interaction count
    - Recency: Points for recent interactions
    - Intent: Points for pricing/demo requests
    - Demographics: Points for larger companies
    """
    
    # Scoring configuration constants
    ENGAGEMENT_POINTS_PER_INTERACTION: int = 5
    ENGAGEMENT_MAX_POINTS: int = 25
    RECENCY_THRESHOLD_DAYS: int = 7
    RECENCY_POINTS: int = 20
    PRICING_REQUEST_POINTS: int = 30
    DEMO_REQUEST_POINTS: int = 15
    LARGE_COMPANY_THRESHOLD: int = 50
    LARGE_COMPANY_POINTS: int = 10
    MAX_SCORE: int = 100
    
    # Priority thresholds
    HOT_THRESHOLD: int = 70
    WARM_THRESHOLD: int = 40
    
    def calculate_score(self, lead: LeadInput) -> ScoringResult:
        """
        Calculate the lead score based on multiple engagement and intent signals.
        
        Args:
            lead: LeadInput object containing lead information
            
        Returns:
            ScoringResult with score, priority classification, and explanations
        """
        score = 0
        explanations: list[str] = []
        
        # 1. Engagement Score: +5 points per interaction (capped at 25)
        engagement_points = min(
            lead.interaction_count * self.ENGAGEMENT_POINTS_PER_INTERACTION,
            self.ENGAGEMENT_MAX_POINTS
        )
        if engagement_points > 0:
            score += engagement_points
            explanations.append(f"High engagement detected (+{engagement_points})")
        
        # 2. Recency Score: +20 points if last interaction was within 7 days
        if lead.last_interaction_days_ago <= self.RECENCY_THRESHOLD_DAYS:
            score += self.RECENCY_POINTS
            explanations.append(f"Recent interaction within {self.RECENCY_THRESHOLD_DAYS} days (+{self.RECENCY_POINTS})")
        
        # 3. Intent Signals
        # +30 points for pricing request
        if lead.has_requested_pricing:
            score += self.PRICING_REQUEST_POINTS
            explanations.append(f"Requested pricing information (+{self.PRICING_REQUEST_POINTS})")
        
        # +15 points for demo request
        if lead.has_demo_request:
            score += self.DEMO_REQUEST_POINTS
            explanations.append(f"Requested product demo (+{self.DEMO_REQUEST_POINTS})")
        
        # 4. Demographics: +10 points for companies with more than 50 employees
        if lead.company_size > self.LARGE_COMPANY_THRESHOLD:
            score += self.LARGE_COMPANY_POINTS
            explanations.append(f"Large company (>{self.LARGE_COMPANY_THRESHOLD} employees) (+{self.LARGE_COMPANY_POINTS})")
        
        # Cap the score at 100
        score = min(score, self.MAX_SCORE)
        
        # Determine priority based on score
        priority = self._calculate_priority(score)
        
        return ScoringResult(
            score=score,
            priority=priority,
            explanations=explanations
        )
    
    def _calculate_priority(self, score: int) -> Priority:
        """
        Determine lead priority based on score thresholds.
        
        Args:
            score: Calculated lead score (0-100)
            
        Returns:
            Priority enum value (Hot, Warm, or Cold)
        """
        if score >= self.HOT_THRESHOLD:
            return Priority.HOT
        elif score >= self.WARM_THRESHOLD:
            return Priority.WARM
        else:
            return Priority.COLD


# Dependency injection helper
def get_scoring_service() -> LeadScoringService:
    """Factory function for dependency injection."""
    return LeadScoringService()
