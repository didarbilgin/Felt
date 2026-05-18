from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.article import Article
from app.schemas.article import ArticleOut

router = APIRouter(prefix="/api/articles", tags=["articles"])


@router.get("", response_model=list[ArticleOut])
def list_published_articles(db: Session = Depends(get_db)):
    return (
        db.query(Article)
        .filter(Article.status == "published")
        .order_by(Article.year.desc(), Article.created_at.desc())
        .all()
    )
