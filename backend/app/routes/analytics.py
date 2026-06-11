from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.models.page_view import PageView
from app.schemas.analytics import (
    AnalyticsSummary,
    PageViewCreate,
    PageViewOut,
    TopPageOut,
)

public_router = APIRouter(prefix="/api/analytics", tags=["analytics"])
admin_router = APIRouter(prefix="/api/admin/analytics", tags=["admin:analytics"])


def _normalize_public_path(path: str) -> str:
    normalized = path.strip()
    if not normalized.startswith("/"):
        normalized = f"/{normalized}"
    if normalized.startswith("/admin"):
        raise HTTPException(status_code=400, detail="Admin paths are not tracked")
    if len(normalized) > 500:
        raise HTTPException(status_code=400, detail="Path too long")
    return normalized


def _utc_today_start() -> datetime:
    now = datetime.now(timezone.utc)
    return now.replace(hour=0, minute=0, second=0, microsecond=0)


@public_router.post("/page-views", response_model=PageViewOut, status_code=201)
def track_page_view(body: PageViewCreate, db: Session = Depends(get_db)):
    path = _normalize_public_path(body.path)
    obj = PageView(path=path, visitor_id=body.visitor_id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@admin_router.get("/summary", response_model=AnalyticsSummary)
def get_analytics_summary(
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    today_start = _utc_today_start()

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

    top_rows = (
        db.query(PageView.path, func.count(PageView.id).label("visits"))
        .group_by(PageView.path)
        .order_by(func.count(PageView.id).desc(), PageView.path.asc())
        .limit(10)
        .all()
    )
    top_pages = [TopPageOut(path=row.path, visits=row.visits) for row in top_rows]

    recent_visits = (
        db.query(PageView)
        .order_by(PageView.visited_at.desc())
        .limit(20)
        .all()
    )

    return AnalyticsSummary(
        total_visits=total_visits,
        today_visits=today_visits,
        unique_visitors=unique_visitors,
        returning_visitors=returning_visitors,
        top_pages=top_pages,
        recent_visits=recent_visits,
    )
