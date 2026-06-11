import os

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.admin_user import AdminUser

DEFAULT_ADMIN_EMAIL = "admin@felt.com"
DEFAULT_ADMIN_PASSWORD = "felt-admin"


def seed_admin_user_if_empty(db: Session) -> str:
    """Create the default admin when no admin users exist."""
    if db.query(AdminUser).count() > 0:
        return "skipped"

    email = os.getenv("ADMIN_EMAIL", DEFAULT_ADMIN_EMAIL).strip()
    password = os.getenv("ADMIN_PASSWORD", DEFAULT_ADMIN_PASSWORD)

    if not email:
        raise ValueError("ADMIN_EMAIL must not be empty when seeding the first admin user.")
    if not password:
        raise ValueError("ADMIN_PASSWORD must not be empty when seeding the first admin user.")

    db.add(
        AdminUser(
            email=email,
            password_hash=hash_password(password),
            role="admin",
        )
    )
    db.commit()
    return "created"


if __name__ == "__main__":
    from app.core.database import SessionLocal

    db = SessionLocal()
    try:
        result = seed_admin_user_if_empty(db)
        print("Admin seed:", result)
    finally:
        db.close()
