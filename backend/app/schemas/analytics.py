from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class PageViewCreate(BaseModel):
    path: str = Field(..., min_length=1, max_length=500)
    visitor_id: UUID


class PageViewOut(BaseModel):
    id: UUID
    path: str
    visitor_id: UUID | None
    visited_at: datetime

    class Config:
        from_attributes = True


class AnalyticsSummary(BaseModel):
    total_visits: int
    today_visits: int
    unique_visitors: int
    returning_visitors: int
