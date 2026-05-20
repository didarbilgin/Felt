from uuid import UUID
from app.utils.slug import slugify
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.models.blog_post import BlogPost
from app.schemas.blog_post import BlogPostCreate, BlogPostOut, BlogPostUpdate

router = APIRouter(prefix="/api/admin/blog", tags=["admin:blog"])


@router.get("", response_model=list[BlogPostOut])
def list_blog_posts(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(BlogPost).order_by(BlogPost.publish_date.desc()).all()


@router.get("/{post_id}", response_model=BlogPostOut)
def get_blog_post(post_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj


@router.post("", response_model=BlogPostOut)
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

@router.put("/{post_id}", response_model=BlogPostOut)
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


@router.delete("/{post_id}")
def delete_blog_post(post_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(obj)
    db.commit()
    return {"ok": True}
