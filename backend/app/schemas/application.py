from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class ApplicationSourceType(str, Enum):
    program = "program"
    event = "event"
    newsletter = "newsletter"
    community = "community"
    blog = "blog"
    contact = "contact"


class ApplicationStatus(str, Enum):
    new = "new"
    reviewed = "reviewed"
    contacted = "contacted"
    rejected = "rejected"


class ApplicationCreate(BaseModel):
    source_type: ApplicationSourceType
    source_id: UUID | None = None
    source_title: str | None = Field(default=None, max_length=500)
    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=64)
    organization: str | None = Field(default=None, max_length=255)
    title: str | None = Field(default=None, max_length=255)
    message: str | None = None

    @field_validator("full_name", "phone", "organization", "title", "source_title", "message", mode="before")
    @classmethod
    def strip_strings(cls, value: str | None) -> str | None:
        if value is None:
            return None
        if isinstance(value, str):
            stripped = value.strip()
            return stripped or None
        return value

    @field_validator("full_name", "phone")
    @classmethod
    def required_not_blank(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("field is required")
        return value.strip()


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    source_type: ApplicationSourceType
    source_id: UUID | None
    source_title: str | None
    full_name: str
    email: EmailStr
    phone: str
    organization: str | None
    title: str | None
    message: str | None
    status: ApplicationStatus
    created_at: datetime
