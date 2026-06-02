from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.article import Article
from app.schemas.article import ArticleOut

router = APIRouter(prefix="/api/articles", tags=["articles"])


@router.get("/slug/{slug}", response_model=ArticleOut)
def get_published_article_by_slug(slug: str, db: Session = Depends(get_db)):
    article = (
        db.query(Article)
        .filter(Article.slug == slug, Article.status == "published")
        .first()
    )
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.get("", response_model=list[ArticleOut])
def list_published_articles(db: Session = Depends(get_db)):
    return (
        db.query(Article)
        .filter(Article.status == "published")
        .order_by(Article.year.desc(), Article.created_at.desc())
        .all()
    )
