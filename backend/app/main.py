from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import app_settings
from app.routes.auth import router as auth_router
from app.routes.articles import router as articles_router
from app.routes.articles_public import router as articles_public_router
from app.routes.blog import admin_router as blog_admin_router
from app.routes.blog import public_router as blog_public_router
from app.routes.contact import admin_router as contact_admin_router
from app.routes.contact import router as contact_router
from app.routes.events import admin_router as events_admin_router

from app.routes.events import public_router as events_public_router
from app.routes.programs import admin_router as programs_admin_router
from app.routes.programs import public_router as programs_public_router
from app.routes.about_sections import admin_router as about_sections_admin_router
from app.routes.about_sections import public_router as about_sections_public_router
from app.routes.pages import admin_router as pages_admin_router
from app.routes.pages import public_router as pages_public_router
from app.routes.applications import admin_router as applications_admin_router
from app.routes.applications import public_router as applications_public_router

app = FastAPI(title="FELT API")

origins = [o.strip() for o in app_settings.CORS_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(articles_public_router)
app.include_router(articles_router)
app.include_router(programs_public_router)
app.include_router(programs_admin_router)
app.include_router(events_public_router)
app.include_router(events_admin_router)
app.include_router(blog_public_router)
app.include_router(blog_admin_router)
app.include_router(contact_router)
app.include_router(contact_admin_router)
app.include_router(about_sections_public_router)
app.include_router(about_sections_admin_router)
app.include_router(pages_public_router)
app.include_router(pages_admin_router)
app.include_router(applications_public_router)
app.include_router(applications_admin_router)

@app.get("/health")
def health():
    return {"status": "ok"}