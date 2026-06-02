from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.models.page import Page, PageSection
from app.schemas.page import (
    PageCreate,
    PageOut,
    PageSectionCreate,
    PageSectionOut,
    PageSectionUpdate,
    PageUpdate,
    PageWithSectionsOut,
)


public_router = APIRouter(prefix="/api/pages", tags=["pages"])
admin_router = APIRouter(prefix="/api/admin/pages", tags=["admin:pages"])


def _page_with_sections(db: Session, page: Page, active_only: bool) -> PageWithSectionsOut:
    query = db.query(PageSection).filter(PageSection.page_key == page.page_key)
    if active_only:
        query = query.filter(PageSection.is_active.is_(True))
    sections = query.order_by(PageSection.sort_order.asc()).all()
    return PageWithSectionsOut(
        id=page.id,
        page_key=page.page_key,
        title=page.title,
        subtitle=page.subtitle,
        slug=page.slug,
        is_active=page.is_active,
        sort_order=page.sort_order,
        created_at=page.created_at,
        updated_at=page.updated_at,
        sections=sections,
    )


@public_router.get("", response_model=list[PageOut])
def list_public_pages(db: Session = Depends(get_db)):
    return (
        db.query(Page)
        .filter(Page.is_active.is_(True))
        .order_by(Page.sort_order.asc())
        .all()
    )


@public_router.get("/{page_key}", response_model=PageWithSectionsOut)
def get_public_page(page_key: str, db: Session = Depends(get_db)):
    page = (
        db.query(Page)
        .filter(Page.page_key == page_key, Page.is_active.is_(True))
        .first()
    )
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return _page_with_sections(db, page, active_only=True)


@admin_router.get("", response_model=list[PageOut])
def list_admin_pages(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(Page).order_by(Page.sort_order.asc()).all()


@admin_router.get("/{page_key}", response_model=PageWithSectionsOut)
def get_admin_page(page_key: str, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    page = db.query(Page).filter(Page.page_key == page_key).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return _page_with_sections(db, page, active_only=False)


@admin_router.put("/{page_id}", response_model=PageOut)
def update_page(
    page_id: UUID,
    body: PageUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    for key, value in body.model_dump(exclude_unset=True, mode="json").items():
        setattr(page, key, value)

    db.commit()
    db.refresh(page)
    return page


@admin_router.post("/sections", response_model=PageSectionOut)
def create_page_section(
    body: PageSectionCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    exists = (
        db.query(PageSection)
        .filter(
            PageSection.page_key == body.page_key,
            PageSection.section_key == body.section_key,
        )
        .first()
    )
    if exists:
        raise HTTPException(status_code=409, detail="Section key already exists for this page")

    obj = PageSection(**body.model_dump(mode="json"))
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@admin_router.put("/sections/{section_id}", response_model=PageSectionOut)
def update_page_section(
    section_id: UUID,
    body: PageSectionUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    obj = db.query(PageSection).filter(PageSection.id == section_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Section not found")

    for key, value in body.model_dump(exclude_unset=True, mode="json").items():
        setattr(obj, key, value)

    db.commit()
    db.refresh(obj)
    return obj


@admin_router.delete("/sections/{section_id}")
def delete_page_section(
    section_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    obj = db.query(PageSection).filter(PageSection.id == section_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Section not found")

    db.delete(obj)
    db.commit()
    return {"ok": True}
