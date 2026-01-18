"""
Database client for Supabase connection.
"""
from supabase import create_client, Client
from app.core.config import settings


# Supabase client singleton
_supabase_client: Client | None = None


def get_supabase_client() -> Client:
    """
    Get the Supabase client instance.
    
    Returns a singleton instance of the Supabase client.
    Raises an error if Supabase credentials are not configured.
    """
    global _supabase_client
    
    if _supabase_client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise ValueError(
                "Supabase credentials not configured. "
                "Please set SUPABASE_URL and SUPABASE_KEY in your .env file."
            )
        _supabase_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )
    
    return _supabase_client


def check_database_connection() -> bool:
    """
    Check if the database connection is working.
    
    Returns True if connection is successful, False otherwise.
    """
    try:
        client = get_supabase_client()
        # Try a simple query to verify connection
        client.table("leads").select("lead_id").limit(1).execute()
        return True
    except Exception:
        return False
