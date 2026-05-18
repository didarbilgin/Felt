from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import decode_access_token
from app.models.admin_user import AdminUser

bearer_scheme = HTTPBearer()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_admin(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> AdminUser:
    token = credentials.credentials

    try:
        payload = decode_access_token(token)
        email = payload.get("sub")
        if not email:
            raise ValueError("Missing sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(AdminUser).filter(AdminUser.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user
