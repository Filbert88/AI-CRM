"""
Custom exception classes for the AI CRM application.
"""
from fastapi import HTTPException, status


class LeadNotFoundException(HTTPException):
    """Exception raised when a lead is not found."""
    
    def __init__(self, lead_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lead with ID '{lead_id}' not found"
        )


class InvalidLeadDataException(HTTPException):
    """Exception raised when lead data is invalid."""
    
    def __init__(self, message: str = "Invalid lead data provided"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )


class ScoringEngineException(HTTPException):
    """Exception raised when scoring engine encounters an error."""
    
    def __init__(self, message: str = "Error occurred during lead scoring"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=message
        )
