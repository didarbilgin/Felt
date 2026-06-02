from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel


class PageBase(BaseModel):
    page_key: str
    title: str
    subtitle: str | None = None
    slug: str | None = None
    is_active: bool = True
    sort_order: int = 0


class PageCreate(PageBase):
    pass


class PageUpdate(BaseModel):
    title: str | None = None
    subtitle: str | None = None
    slug: str | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class PageOut(PageBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PageSectionBase(BaseModel):
    page_key: str
    section_key: str
    section_type: str = "text"
    title: str | None = None
    subtitle: str | None = None
    content: str | None = None
    items: Any | None = None
    sort_order: int = 0
    is_active: bool = True


class PageSectionCreate(PageSectionBase):
    pass


class PageSectionUpdate(BaseModel):
    section_type: str | None = None
    title: str | None = None
    subtitle: str | None = None
    content: str | None = None
    items: Any | None = None
    sort_order: int | None = None
    is_active: bool | None = None


class PageSectionOut(PageSectionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PageWithSectionsOut(PageOut):
    sections: list[PageSectionOut] = []
