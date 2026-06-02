from uuid import UUID

from app.utils.slug import slugify
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.models.blog_post import BlogPost
from app.schemas.blog_post import BlogPostCreate, BlogPostOut, BlogPostUpdate

admin_router = APIRouter(prefix="/api/admin/blog", tags=["admin:blog"])
public_router = APIRouter(prefix="/api/blog-posts", tags=["blog-posts"])


@public_router.get("", response_model=list[BlogPostOut])
def list_published_blog_posts(db: Session = Depends(get_db)):
    return (
        db.query(BlogPost)
        .filter(BlogPost.status == "published")
        .order_by(BlogPost.publish_date.desc())
        .all()
    )


@public_router.get("/slug/{slug}", response_model=BlogPostOut)
def get_published_blog_post_by_slug(slug: str, db: Session = Depends(get_db)):
    post = (
        db.query(BlogPost)
        .filter(BlogPost.slug == slug, BlogPost.status == "published")
        .first()
    )
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


@admin_router.get("", response_model=list[BlogPostOut])
def list_blog_posts(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(BlogPost).order_by(BlogPost.publish_date.desc()).all()


@admin_router.get("/{post_id}", response_model=BlogPostOut)
def get_blog_post(post_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj


@admin_router.post("", response_model=BlogPostOut)
def create_blog_post(
    body: BlogPostCreate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    base_slug = slugify(body.title)
    slug = base_slug
    counter = 1

    while db.query(BlogPost).filter(BlogPost.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    data = body.model_dump(mode="json")
    data["slug"] = slug

    obj = BlogPost(**data)

    db.add(obj)
    db.commit()
    db.refresh(obj)

    return obj


@admin_router.put("/{post_id}", response_model=BlogPostOut)
def update_blog_post(post_id: UUID, body: BlogPostUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")

    data = body.model_dump(exclude_unset=True, mode="json")

    for key, value in data.items():
        setattr(obj, key, value)

    db.commit()
    db.refresh(obj)
    return obj


@admin_router.delete("/{post_id}")
def delete_blog_post(post_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(obj)
    db.commit()
    return {"ok": True}
