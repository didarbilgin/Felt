from datetime import datetime, timezone
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.models.page_view import PageView
from app.schemas.analytics import (
    AnalyticsSummary,
    PageViewCreate,
    PageViewOut,
)

public_router = APIRouter(prefix="/api/analytics", tags=["analytics"])
admin_router = APIRouter(prefix="/api/admin/analytics", tags=["admin:analytics"])

SITE_ENTRY_PATH = "/"
ANALYTICS_TZ = ZoneInfo("Europe/Istanbul")


def _normalize_public_path(path: str) -> str:
    normalized = path.strip()
    if not normalized.startswith("/"):
        normalized = f"/{normalized}"
    if normalized.startswith("/admin"):
        raise HTTPException(status_code=400, detail="Admin paths are not tracked")
    if len(normalized) > 500:
        raise HTTPException(status_code=400, detail="Path too long")
    return normalized


def _istanbul_today_start_utc() -> datetime:
    """Start of the current calendar day in Turkey (Europe/Istanbul), as UTC."""
    now_local = datetime.now(ANALYTICS_TZ)
    start_local = now_local.replace(hour=0, minute=0, second=0, microsecond=0)
    return start_local.astimezone(timezone.utc)


@public_router.post("/page-views", response_model=PageViewOut, status_code=201)
def track_page_view(body: PageViewCreate, db: Session = Depends(get_db)):
    _normalize_public_path(body.path)
    obj = PageView(path=SITE_ENTRY_PATH, visitor_id=body.visitor_id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@admin_router.get("/summary", response_model=AnalyticsSummary)
def get_analytics_summary(
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    today_start = _istanbul_today_start_utc()

    total_visits = db.query(func.count(PageView.id)).scalar() or 0
    today_visits = (
        db.query(func.count(PageView.id))
        .filter(PageView.visited_at >= today_start)
        .scalar()
        or 0
    )

    unique_visitors = (
        db.query(func.count(func.distinct(PageView.visitor_id)))
        .filter(PageView.visitor_id.isnot(None))
        .scalar()
        or 0
    )

    returning_visitors = len(
        db.query(PageView.visitor_id)
        .filter(PageView.visitor_id.isnot(None))
        .group_by(PageView.visitor_id)
        .having(func.count(PageView.id) > 1)
        .all()
    )

    return AnalyticsSummary(
        total_visits=total_visits,
        today_visits=today_visits,
        unique_visitors=unique_visitors,
        returning_visitors=returning_visitors,
    )
