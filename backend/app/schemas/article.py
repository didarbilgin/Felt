from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


class ArticleStatus(str, Enum):
    draft = "draft"
    published = "published"
    archived = "archived"


class ArticleCreate(BaseModel):
    title: str
    slug: str | None = None
    abstract: str | None = None
    detail_description: str | None = None
    content: str
    article_type: str = "article"
    year: int | None = None
    language: str = "TR"
    source: str | None = None
    tags: list[str] = Field(default_factory=list)
    link: str | None = None
    doi: str | None = None
    authors: str | None = None
    cover_image: str | None = None
    pdf_link: str | None = None
    status: ArticleStatus = ArticleStatus.draft


class ArticleUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    abstract: str | None = None
    detail_description: str | None = None
    content: str | None = None
    article_type: str | None = None
    year: int | None = None
    language: str | None = None
    source: str | None = None
    tags: list[str] | None = None
    link: str | None = None
    doi: str | None = None
    authors: str | None = None
    cover_image: str | None = None
    pdf_link: str | None = None
    status: ArticleStatus | None = None


class ArticleOut(BaseModel):
    id: UUID
    title: str
    slug: str
    abstract: str | None
    detail_description: str | None
    content: str
    article_type: str
    year: int
    language: str
    source: str | None
    tags: list[str]
    link: str | None
    doi: str | None
    authors: str | None
    cover_image: str | None
    pdf_link: str | None
    status: ArticleStatus
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
