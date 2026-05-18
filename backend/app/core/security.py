from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import app_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

TOKEN_TYPE_ACCESS = "access"
TOKEN_TYPE_REFRESH = "refresh"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def _encode(payload: dict) -> str:
    return jwt.encode(payload, app_settings.JWT_SECRET, algorithm=app_settings.JWT_ALG)


def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=app_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": subject, "exp": expire, "type": TOKEN_TYPE_ACCESS}
    return _encode(payload)


def create_refresh_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=app_settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {"sub": subject, "exp": expire, "type": TOKEN_TYPE_REFRESH}
    return _encode(payload)


def _decode_raw(token: str) -> dict:
    return jwt.decode(token, app_settings.JWT_SECRET, algorithms=[app_settings.JWT_ALG])


def decode_access_token(token: str) -> dict:
    try:
        payload = _decode_raw(token)
    except JWTError as e:
        raise ValueError("Invalid access token") from e
    if payload.get("type") != TOKEN_TYPE_ACCESS:
        raise ValueError("Not an access token")
    return payload


def decode_refresh_token(token: str) -> dict:
    try:
        payload = _decode_raw(token)
    except JWTError as e:
        raise ValueError("Invalid refresh token") from e
    if payload.get("type") != TOKEN_TYPE_REFRESH:
        raise ValueError("Not a refresh token")
    return payload
