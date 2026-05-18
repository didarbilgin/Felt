import os
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.admin_user import AdminUser
from app.core.security import hash_password

EMAIL = os.getenv("ADMIN_EMAIL", "admin@felt.com")
PASSWORD = os.getenv("ADMIN_PASSWORD", "felt-admin")

def main():
    db: Session = SessionLocal()
    try:
        user = db.query(AdminUser).filter(AdminUser.email == EMAIL).first()
        if user:
            print("Admin already exists:", EMAIL)
            return
        user = AdminUser(email=EMAIL, password_hash=hash_password(PASSWORD), role="admin")
        db.add(user)
        db.commit()
        print("Created admin:", EMAIL, "password:", PASSWORD)
    finally:
        db.close()

if __name__ == "__main__":
    main()