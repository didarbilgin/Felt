from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.api.deps import get_db, get_current_admin
from app.models.article import Article
from app.schemas.article import ArticleCreate, ArticleUpdate, ArticleOut, ArticleStatus
from app.utils.slug import slugify

router = APIRouter(prefix="/api/admin/articles", tags=["admin:articles"])


@router.get("", response_model=list[ArticleOut])
def list_articles(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(Article).order_by(Article.created_at.desc()).all()


@router.post("", response_model=ArticleOut)
def create_article(body: ArticleCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    data = body.model_dump(mode="json")
    slug = (data.pop("slug") or "").strip() or slugify(data["title"])
    if not slug:
        raise HTTPException(status_code=400, detail="Could not generate slug from title")

    exists = db.query(Article).filter(Article.slug == slug).first()
    if exists:
        raise HTTPException(status_code=409, detail="Slug already exists")

    year = data.pop("year", None)
    if year is None:
        year = datetime.now().year

    status_str = data.get("status") or ArticleStatus.draft.value
    published_at = datetime.now(timezone.utc) if status_str == ArticleStatus.published.value else None

    obj = Article(
        slug=slug,
        year=year,
        published_at=published_at,
        title=data["title"],
        abstract=data.get("abstract"),
        content=data["content"],
        article_type=data.get("article_type") or "article",
        language=data.get("language") or "TR",
        source=data.get("source"),
        tags=data.get("tags") or [],
        link=data.get("link"),
        doi=data.get("doi"),
        authors=data.get("authors"),
        cover_image=data.get("cover_image"),
        pdf_link=data.get("pdf_link"),
        status=status_str,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/{article_id}", response_model=ArticleOut)
def update_article(article_id: UUID, body: ArticleUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(Article).filter(Article.id == article_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")

    data = body.model_dump(exclude_unset=True, mode="json")
    if "slug" in data and data["slug"] is not None:
        data["slug"] = data["slug"].strip()
        if data["slug"] == "":
            data.pop("slug")
    if "slug" not in data and data.get("title"):
        data["slug"] = slugify(data["title"])
    if "slug" in data:
        exists = db.query(Article).filter(Article.slug == data["slug"], Article.id != article_id).first()
        if exists:
            raise HTTPException(status_code=409, detail="Slug already exists")

    for k, v in data.items():
        setattr(obj, k, v)

    if obj.status == "published" and obj.published_at is None:
        obj.published_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{article_id}")
def delete_article(article_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(Article).filter(Article.id == article_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(obj)
    db.commit()
    return {"ok": True}
