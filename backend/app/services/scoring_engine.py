"""
Lead Scoring Service - Core Business Logic

This module implements rule-based lead scoring that is extensible for future ML integration.
"""
from abc import ABC, abstractmethod
from app.models.schemas import LeadInput, ScoringResult, Priority


class BaseScoringEngine(ABC):
    """
    Abstract base class for lead scoring engines.
    
    This class allows swapping between rule-based and AI-powered scoring.
    """
    
    @abstractmethod
    def calculate_score(self, lead: LeadInput) -> ScoringResult:
        """
        Calculate the lead score.
        
        Args:
            lead: LeadInput object containing lead information
            
        Returns:
            ScoringResult with score (0-100), priority, and human-readable explanations
        """
        pass
    
    def _calculate_priority(self, score: int, hot_threshold: int = 70, warm_threshold: int = 40) -> Priority:
        """
        Determine lead priority based on score thresholds.
        Shared utility method for all engines.
        """
        if score >= hot_threshold:
            return Priority.HOT
        elif score >= warm_threshold:
            return Priority.WARM
        else:
            return Priority.COLD


class RuleBasedScoringEngine(BaseScoringEngine):
    """
    Rule-based lead scoring using weighted signals.
    
    Scoring Criteria:
    - Engagement: +5 points per interaction (max 25)
    - Recency: +20 points if interaction within 7 days
    - Pricing Request: +30 points
    - Demo Request: +15 points
    - Large Company (>50 employees): +10 points
    """
    
    # Scoring configuration
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
        """Calculate score using weighted rules."""
        score = 0
        explanations: list[str] = []
        
        # 1. Engagement Score
        engagement_points = min(
            lead.interaction_count * self.ENGAGEMENT_POINTS_PER_INTERACTION,
            self.ENGAGEMENT_MAX_POINTS
        )
        if engagement_points > 0:
            score += engagement_points
            explanations.append(f"High engagement detected (+{engagement_points})")
        
        # 2. Recency Score
        if lead.last_interaction_days_ago <= self.RECENCY_THRESHOLD_DAYS:
            score += self.RECENCY_POINTS
            explanations.append(f"Recent interaction within {self.RECENCY_THRESHOLD_DAYS} days (+{self.RECENCY_POINTS})")
        
        # 3. Intent Signals
        if lead.has_requested_pricing:
            score += self.PRICING_REQUEST_POINTS
            explanations.append(f"Requested pricing information (+{self.PRICING_REQUEST_POINTS})")
        
        if lead.has_demo_request:
            score += self.DEMO_REQUEST_POINTS
            explanations.append(f"Requested product demo (+{self.DEMO_REQUEST_POINTS})")
        
        # 4. Demographics
        if lead.company_size > self.LARGE_COMPANY_THRESHOLD:
            score += self.LARGE_COMPANY_POINTS
            explanations.append(f"Large company (>{self.LARGE_COMPANY_THRESHOLD} employees) (+{self.LARGE_COMPANY_POINTS})")
        
        # Cap the score
        score = min(score, self.MAX_SCORE)
        priority = self._calculate_priority(score, self.HOT_THRESHOLD, self.WARM_THRESHOLD)
        
        return ScoringResult(score=score, priority=priority, explanations=explanations)


class AIScoringEngine(BaseScoringEngine):
    """
    AI-powered lead scoring using ML models.
    
    This is a placeholder for future ML integration.
    When implemented, this will:
    - Load a trained model (e.g., XGBoost, Neural Network)
    - Use the model to predict conversion probability
    - Generate human-readable insights using LLM
    
    Example future usage:
        engine = AIScoringEngine(model_path="models/lead_scorer.pkl")
        result = engine.calculate_score(lead)
    """
    
    def __init__(self, model_path: str = None, llm_client = None):
        """
        Initialize AI scoring engine.
        
        Args:
            model_path: Path to trained ML model file
            llm_client: Optional LLM client for generating explanations
        """
        self.model_path = model_path
        self.llm_client = llm_client
        self._model = None
        # self._load_model()  # Uncomment when implementing
    
    def _load_model(self):
        """Load the ML model from disk."""
        # Future implementation:
        # import joblib
        # self._model = joblib.load(self.model_path)
        pass
    
    def _prepare_features(self, lead: LeadInput) -> list:
        """Convert lead data to feature vector for model input."""
        return [
            lead.interaction_count,
            lead.last_interaction_days_ago,
            int(lead.has_requested_pricing),
            int(lead.has_demo_request),
            lead.company_size,
            # Add more features as needed
        ]
    
    def _generate_ai_explanation(self, lead: LeadInput, score: int, priority: Priority) -> list[str]:
        """
        Generate human-readable insights using LLM.
        
        This could use OpenAI GPT, Anthropic Claude, etc. to create
        personalized, context-aware explanations.
        """
        # Future implementation with LLM:
        # prompt = f"Explain why this lead scored {score}/100..."
        # response = self.llm_client.complete(prompt)
        # return [response]
        
        # Fallback to basic explanations
        explanations = []
        if priority == Priority.HOT:
            explanations.append("AI analysis indicates high conversion likelihood")
        elif priority == Priority.WARM:
            explanations.append("AI analysis shows moderate buying signals")
        else:
            explanations.append("AI analysis suggests nurturing required")
        
        if lead.has_requested_pricing:
            explanations.append("Strong purchase intent detected from pricing inquiry")
        if lead.has_demo_request:
            explanations.append("Product interest confirmed via demo request")
            
        return explanations
    
    def calculate_score(self, lead: LeadInput) -> ScoringResult:
        """
        Calculate score using AI/ML model.
        
        Currently falls back to rule-based scoring.
        Replace with actual model prediction when ready.
        """
        # Future implementation:
        # features = self._prepare_features(lead)
        # score = int(self._model.predict_proba([features])[0][1] * 100)
        
        # Fallback to rule-based until model is trained
        fallback_engine = RuleBasedScoringEngine()
        rule_result = fallback_engine.calculate_score(lead)
        
        # Override explanations with AI-generated ones
        ai_explanations = self._generate_ai_explanation(
            lead, rule_result.score, rule_result.priority
        )
        
        return ScoringResult(
            score=rule_result.score,
            priority=rule_result.priority,
            explanations=ai_explanations
        )


# Change this to switch between rule-based and AI scoring
SCORING_ENGINE_TYPE = "rule_based"  # Options: "rule_based", "ai"


def get_scoring_service() -> BaseScoringEngine:
    """
    Factory function for dependency injection.
    
    Returns the configured scoring engine based on SCORING_ENGINE_TYPE.
    Can be extended to use environment variables for configuration.
    """
    if SCORING_ENGINE_TYPE == "ai":
        return AIScoringEngine(
            model_path="models/lead_scorer.pkl",
            # llm_client=your_llm_client
        )
    else:
        return RuleBasedScoringEngine()

LeadScoringService = RuleBasedScoringEngine
