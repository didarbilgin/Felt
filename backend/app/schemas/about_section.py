from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel


class AboutSectionBase(BaseModel):
    section_key: str
    title: str
    content: str | None = None
    items: Any | None = None
    sort_order: int = 0
    is_active: bool = True


class AboutSectionCreate(AboutSectionBase):
    pass


class AboutSectionUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    items: Any | None = None
    sort_order: int | None = None
    is_active: bool | None = None


class AboutSectionOut(AboutSectionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True