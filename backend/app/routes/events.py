from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.models.event import Event
from app.schemas.event import EventCreate, EventOut, EventUpdate


admin_router = APIRouter(prefix="/api/admin/events", tags=["admin:events"])
public_router = APIRouter(prefix="/api/events", tags=["events"])


@public_router.get("", response_model=list[EventOut])
def list_public_events(db: Session = Depends(get_db)):
    return (
        db.query(Event)
        .filter(Event.status != "archived")
        .order_by(Event.date.asc())
        .all()
    )


@admin_router.get("", response_model=list[EventOut])
def list_admin_events(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return (
        db.query(Event)
        .order_by(Event.date.desc())
        .all()
    )


@admin_router.get("/{event_id}", response_model=EventOut)
def get_event(event_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(Event).filter(Event.id == event_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj


@admin_router.post("", response_model=EventOut)
def create_event(body: EventCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = Event(**body.model_dump(mode="json"))
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@admin_router.put("/{event_id}", response_model=EventOut)
def update_event(event_id: UUID, body: EventUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(Event).filter(Event.id == event_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")

    for key, value in body.model_dump(exclude_unset=True, mode="json").items():
        setattr(obj, key, value)

    db.commit()
    db.refresh(obj)
    return obj


@admin_router.delete("/{event_id}")
def delete_event(event_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(Event).filter(Event.id == event_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(obj)
    db.commit()
    return {"ok": True}