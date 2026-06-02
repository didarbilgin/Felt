from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class ProgramStatus(str, Enum):
    draft = "draft"
    active = "active"
    archived = "archived"


class ProgramCreate(BaseModel):
    title: str
    category: str
    target_audience: str
    description: str
    detail_description: str | None = None
    link: str | None = None
    duration: str
    status: ProgramStatus = ProgramStatus.draft


class ProgramUpdate(BaseModel):
    title: str | None = None
    category: str | None = None
    target_audience: str | None = None
    description: str | None = None
    detail_description: str | None = None
    link: str | None = None
    duration: str | None = None
    status: ProgramStatus | None = None


class ProgramOut(BaseModel):
    id: UUID
    title: str
    category: str
    target_audience: str
    description: str
    detail_description: str | None
    link: str | None
    duration: str
    status: ProgramStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
