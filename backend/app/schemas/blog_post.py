from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class BlogStatus(str, Enum):
    draft = "draft"
    published = "published"
    archived = "archived"


class BlogPostCreate(BaseModel):
    title: str
    category: str
    content: str
    excerpt: str
    detail_description: str | None = None
    link: str | None = None
    publish_date: datetime
    status: BlogStatus = BlogStatus.draft


class BlogPostUpdate(BaseModel):
    title: str | None = None
    category: str | None = None
    content: str | None = None
    excerpt: str | None = None
    detail_description: str | None = None
    link: str | None = None
    publish_date: datetime | None = None
    status: BlogStatus | None = None


class BlogPostOut(BaseModel):
    id: UUID
    title: str
    slug: str
    category: str
    content: str
    excerpt: str
    detail_description: str | None
    link: str | None
    publish_date: datetime
    status: BlogStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True