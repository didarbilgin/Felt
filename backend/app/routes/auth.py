from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_admin
from app.core.security import create_access_token, decode_refresh_token
from app.models.admin_user import AdminUser
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    AccessTokenResponse,
    RefreshRequest,
    MeResponse,
)
from app.services.auth_service import login

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def do_login(body: LoginRequest, db: Session = Depends(get_db)):
    access_token, refresh_token = login(db, body.email, body.password)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=AccessTokenResponse)
def refresh_tokens(body: RefreshRequest, db: Session = Depends(get_db)):
    try:
        payload = decode_refresh_token(body.refresh_token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = db.query(AdminUser).filter(AdminUser.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return AccessTokenResponse(access_token=create_access_token(subject=user.email))


@router.get("/me", response_model=MeResponse)
def me(current=Depends(get_current_admin)):
    return MeResponse(email=current.email, role=current.role)
