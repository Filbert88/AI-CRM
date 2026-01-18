from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from supabase import Client

from app.core.config import settings
from app.core.database import get_supabase_client
from app.core import security
from app.models.user import TokenData, UserResponse
from app.models.schemas import DashboardSummary 

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    client: Client = Depends(get_supabase_client)
) -> UserResponse:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except (JWTError, ValidationError):
        raise credentials_exception
        
    # Fetch user from DB
    response = client.table("users").select("*").eq("email", token_data.email).execute()
    if not response.data:
        raise credentials_exception
        
    user_data = response.data[0]
    return UserResponse(
        id=user_data["id"],
        email=user_data["email"],
        full_name=user_data["full_name"]
    )
