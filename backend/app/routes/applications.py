from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.models.application import Application
from app.schemas.application import (
    ApplicationCreate,
    ApplicationOut,
    ApplicationSourceType,
    ApplicationStatus,
    ApplicationStatusUpdate,
)

public_router = APIRouter(prefix="/api/applications", tags=["applications"])
admin_router = APIRouter(prefix="/api/admin/applications", tags=["admin:applications"])


@public_router.post("", response_model=ApplicationOut, status_code=201)
def create_application(body: ApplicationCreate, db: Session = Depends(get_db)):
    obj = Application(
        source_type=body.source_type.value,
        source_id=body.source_id,
        source_title=body.source_title,
        full_name=body.full_name.strip(),
        email=body.email.strip().lower(),
        phone=body.phone.strip(),
        organization=body.organization,
        title=body.title,
        message=body.message,
        status=ApplicationStatus.new.value,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@admin_router.get("", response_model=list[ApplicationOut])
def list_applications(
    source_type: ApplicationSourceType | None = Query(default=None),
    source_id: UUID | None = Query(default=None),
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    query = db.query(Application)
    if source_type is not None:
        query = query.filter(Application.source_type == source_type.value)
    if source_id is not None:
        query = query.filter(Application.source_id == source_id)
    return query.order_by(Application.created_at.desc()).all()


@admin_router.patch("/{application_id}", response_model=ApplicationOut)
def update_application_status(
    application_id: UUID,
    body: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    obj = db.query(Application).filter(Application.id == application_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Application not found")
    obj.status = body.status.value
    db.commit()
    db.refresh(obj)
    return obj
