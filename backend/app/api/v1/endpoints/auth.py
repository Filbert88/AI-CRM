from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from supabase import Client

from app.core import security
from app.core.config import settings
from app.core.database import get_supabase_client
from app.api.deps import get_current_user
from app.models.user import UserCreate, UserResponse, Token

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(
    user_in: UserCreate,
    client: Client = Depends(get_supabase_client)
) -> Any:
    """
    Register a new user.
    """
    # Check if user exists
    existing = client.table("users").select("email").eq("email", user_in.email).execute()
    if existing.data:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    hashed_password = security.get_password_hash(user_in.password)
    
    user_data = {
        "email": user_in.email,
        "hashed_password": hashed_password,
        "full_name": user_in.full_name,
    }
    
    response = client.table("users").insert(user_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create user")
        
    created_user = response.data[0]
    return UserResponse(
        id=created_user["id"],
        email=created_user["email"],
        full_name=created_user["full_name"]
    )

@router.post("/token", response_model=Token)
def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    client: Client = Depends(get_supabase_client)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    # Find user by email
    response = client.table("users").select("*").eq("email", form_data.username).execute()
    
    user = response.data[0] if response.data else None
    
    if not user or not security.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user["email"], expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserResponse)
def read_users_me(
    current_user: UserResponse = Depends(get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
