from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.admin_user import AdminUser
from app.core.security import verify_password, create_access_token, create_refresh_token


def login(db: Session, email: str, password: str) -> tuple[str, str]:
    user = db.query(AdminUser).filter(AdminUser.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access = create_access_token(subject=user.email)
    refresh = create_refresh_token(subject=user.email)
    return access, refresh
