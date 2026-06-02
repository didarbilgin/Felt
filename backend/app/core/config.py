from pathlib import Path
from pydantic_settings import BaseSettings

ROOT_DIR = Path(__file__).resolve().parents[3]

class DBSettings(BaseSettings):
    DATABASE_URL: str

    class Config:
        env_file = ROOT_DIR / ".env"
        extra = "ignore"

class AppSettings(BaseSettings):
    JWT_SECRET: str
    JWT_ALG: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    CORS_ORIGINS: str = (
        "http://localhost:5173,"
        "http://localhost:8080,"
        "http://localhost:8081,"
        "http://127.0.0.1:8080,"
        "http://127.0.0.1:8081"
    )

    class Config:
        env_file = ROOT_DIR / ".env"
        extra = "ignore"

db_settings = DBSettings()
app_settings = AppSettings()