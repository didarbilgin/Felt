from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str | None = None
    type: str | None = None
    message: str


class ContactMessageOut(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    subject: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


class NewsletterSubscribeCreate(BaseModel):
    email: EmailStr


class NewsletterSubscriptionOut(BaseModel):
    id: UUID
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True
