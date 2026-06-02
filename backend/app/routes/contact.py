from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.models.contact_message import ContactMessage
from app.models.newsletter_subscription import NewsletterSubscription
from app.schemas.contact import (
    ContactMessageCreate,
    ContactMessageOut,
    NewsletterSubscribeCreate,
    NewsletterSubscriptionOut,
)

router = APIRouter(tags=["public:contact"])
admin_router = APIRouter(prefix="/api/admin/contact-messages", tags=["admin:contact-messages"])


@router.post("/api/contact/messages", response_model=ContactMessageOut)
def create_contact_message(body: ContactMessageCreate, db: Session = Depends(get_db)):
    subject = body.subject or body.type
    if not subject:
        raise HTTPException(status_code=422, detail="subject or type is required")

    obj = ContactMessage(
        name=body.name,
        email=body.email,
        subject=subject,
        message=body.message,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.post("/api/newsletter/subscribe", response_model=NewsletterSubscriptionOut)
def subscribe_newsletter(body: NewsletterSubscribeCreate, db: Session = Depends(get_db)):
    exists = db.query(NewsletterSubscription).filter(NewsletterSubscription.email == body.email).first()
    if exists:
        raise HTTPException(status_code=409, detail="This email is already subscribed")

    obj = NewsletterSubscription(email=body.email)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@admin_router.get("", response_model=list[ContactMessageOut])
def list_contact_messages(
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    return (
        db.query(ContactMessage)
        .order_by(ContactMessage.created_at.desc())
        .all()
    )
