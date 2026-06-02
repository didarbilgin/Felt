from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class EventStatus(str, Enum):
    active = "active"
    completed = "completed"
    cancelled = "cancelled"
    archived = "archived"


class EventCreate(BaseModel):
    title: str
    type: str
    date: datetime
    location: str
    description: str
    detail_description: str | None = None
    link: str | None = None
    status: EventStatus = EventStatus.active


class EventUpdate(BaseModel):
    title: str | None = None
    type: str | None = None
    date: datetime | None = None
    location: str | None = None
    description: str | None = None
    detail_description: str | None = None
    link: str | None = None
    status: EventStatus | None = None


class EventOut(BaseModel):
    id: UUID
    title: str
    type: str
    date: datetime
    location: str
    description: str
    detail_description: str | None
    link: str | None
    status: EventStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True