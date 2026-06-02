from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.models.about_section import AboutSection
from app.schemas.about_section import (
    AboutSectionCreate,
    AboutSectionOut,
    AboutSectionUpdate,
)


public_router = APIRouter(prefix="/api/about-sections", tags=["about-sections"])
admin_router = APIRouter(prefix="/api/admin/about-sections", tags=["admin:about-sections"])

FOUNDER_CV_BOOTSTRAP = {
    "section_key": "founder-cv",
    "title": "Kurucunun Özgeçmişi",
    "content": """Dr. Hümeyra Kalafat, eğitim liderliği, gelecek okuryazarlığı ve teknoloji destekli öğrenme alanlarında çalışan bir eğitimci ve eğitim stratejistidir.

Yüksek lisans ve doktora çalışmalarını eğitim bilimleri ve liderlik alanlarında tamamlamış; okul, üniversite ve uluslararası projelerde eğitim dönüşümü, yapay zekâ ve insan merkezli öğrenme modelleri üzerine araştırma ve uygulama programları yürütmüştür.

FELT'i, eğitimin geleceğine dair düşünce, araştırma ve uygulamayı bir araya getiren büyüyen bir ekosistem olarak kurmuştur.""",
    "items": None,
    "sort_order": 2,
    "is_active": True,
}


def _ensure_founder_cv_section(db: Session) -> None:
    existing = (
        db.query(AboutSection)
        .filter(AboutSection.section_key == "founder-cv")
        .first()
    )
    if existing:
        if not existing.is_active:
            existing.is_active = True
            existing.title = FOUNDER_CV_BOOTSTRAP["title"]
            if not existing.content:
                existing.content = FOUNDER_CV_BOOTSTRAP["content"]
            db.commit()
        return

    db.add(AboutSection(**FOUNDER_CV_BOOTSTRAP))
    db.commit()


@public_router.get("", response_model=list[AboutSectionOut])
def list_public_about_sections(db: Session = Depends(get_db)):
    _ensure_founder_cv_section(db)
    return (
        db.query(AboutSection)
        .filter(AboutSection.is_active.is_(True))
        .order_by(AboutSection.sort_order.asc())
        .all()
    )


@admin_router.get("", response_model=list[AboutSectionOut])
def list_admin_about_sections(
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    return db.query(AboutSection).order_by(AboutSection.sort_order.asc()).all()


@admin_router.post("", response_model=AboutSectionOut)
def create_about_section(
    body: AboutSectionCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    exists = (
        db.query(AboutSection)
        .filter(AboutSection.section_key == body.section_key)
        .first()
    )

    if exists:
        raise HTTPException(status_code=409, detail="Section key already exists")

    obj = AboutSection(**body.model_dump(mode="json"))
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@admin_router.put("/{section_id}", response_model=AboutSectionOut)
def update_about_section(
    section_id: UUID,
    body: AboutSectionUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    obj = db.query(AboutSection).filter(AboutSection.id == section_id).first()

    if not obj:
        raise HTTPException(status_code=404, detail="Not found")

    for key, value in body.model_dump(exclude_unset=True, mode="json").items():
        setattr(obj, key, value)

    db.commit()
    db.refresh(obj)
    return obj


@admin_router.delete("/{section_id}")
def delete_about_section(
    section_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    obj = db.query(AboutSection).filter(AboutSection.id == section_id).first()

    if not obj:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(obj)
    db.commit()
    return {"ok": True}