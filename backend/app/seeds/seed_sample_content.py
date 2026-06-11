from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.article import Article
from app.models.blog_post import BlogPost
from app.models.event import Event
from app.models.program import Program
SAMPLE_PROGRAM = {
    "title": "Örnek Eğitim Programı",
    "category": "education-module",
    "target_audience": "Eğitimciler ve okul liderleri",
    "description": (
        "Bu örnek program, FELT platformundaki program kartlarının nasıl göründüğünü "
        "göstermek için oluşturulmuştur. İçeriği yönetim panelinden düzenleyebilir veya silebilirsiniz."
    ),
    "detail_description": (
        "Program kapsamında yapay zekâ okuryazarlığı, öğrenme tasarımı ve kurum içi "
        "uygulama atölyeleri yer alır. Bu metin yalnızca demo amaçlıdır."
    ),
    "duration": "8 hafta",
    "status": "active",
}

SAMPLE_EVENT = {
    "title": "FELT Summit 2026",
    "type": "summit",
    "location": "İstanbul, Türkiye",
    "description": (
        "Yıllık zirve etkinliğimizin örnek kaydı. Eğitim, liderlik ve teknoloji "
        "odaklı oturumlar için demo içeriktir."
    ),
    "detail_description": (
        "Katılımcılar ana oturumlar, atölye çalışmaları ve networking buluşmalarına "
        "davetlidir. Tarih ve program detaylarını yönetim panelinden güncelleyebilirsiniz."
    ),
    "status": "active",
}

SAMPLE_BLOG = {
    "title": "Eğitimin Geleceğine Dair İlk Notlar",
    "slug": "egitimin-gelecegine-dair-ilk-notlar",
    "category": "essay",
    "excerpt": (
        "Yapay zekâ çağında eğitim kurumlarının karşılaştığı fırsatlar ve etik sorular "
        "üzerine kısa bir başlangıç yazısı."
    ),
    "content": (
        "Bu örnek blog yazısı, FELT sitesindeki blog listesinin nasıl göründüğünü "
        "göstermek için eklenmiştir.\n\n"
        "Eğitimde teknoloji kullanımı yalnızca araç seçimi değil; öğrenme kültürünü, "
        "liderlik modellerini ve topluluk dinamiklerini yeniden düşünmeyi gerektirir. "
        "FELT olarak bu dönüşümü araştırma, program ve topluluk çalışmalarıyla destekliyoruz.\n\n"
        "Bu içeriği yönetim panelinden düzenleyebilir veya silebilirsiniz."
    ),
    "status": "published",
}

SAMPLE_ARTICLE = {
    "title": "Yapay Zeka ve Eğitimde Etik İlkeler",
    "slug": "yapay-zeka-ve-egitimde-etik-ilkeler",
    "abstract": (
        "Yapay zekânın eğitim süreçlerine entegrasyonunda dikkate alınması gereken "
        "temel etik ilkeleri özetleyen örnek araştırma kaydı."
    ),
    "content": (
        "Bu örnek makale, Araştırma & Yayınlar sayfasında listelenen içeriklerin "
        "yapısını göstermek için oluşturulmuştur.\n\n"
        "Öğrenci verisi gizliliği, algoritmik şeffaflık, öğretmen özerkliği ve "
        "eşitlik ilkeleri; yapay zekâ destekli öğrenme ortamlarında birlikte "
        "değerlendirilmelidir.\n\n"
        "Detaylı metin ve kaynak bilgilerini yönetim panelinden güncelleyebilirsiniz."
    ),
    "article_type": "article",
    "year": 2026,
    "language": "TR",
    "authors": "Dr. Hümeyra Kalafat",
    "source": "FELT Örnek Yayın",
    "tags": ["yapay zeka", "etik", "eğitim"],
    "status": "published",
}


def _future_event_date() -> datetime:
    return datetime.now(timezone.utc) + timedelta(days=90)


def seed_sample_content_if_empty(db: Session) -> dict[str, str]:
    """Insert one demo row per content table when the table is empty."""
    results: dict[str, str] = {}

    if db.query(Program).count() == 0:
        db.add(Program(**SAMPLE_PROGRAM))
        results["programs"] = "created"
    else:
        results["programs"] = "skipped"

    if db.query(Event).count() == 0:
        db.add(Event(**SAMPLE_EVENT, date=_future_event_date()))
        results["events"] = "created"
    else:
        results["events"] = "skipped"

    if db.query(BlogPost).count() == 0:
        db.add(
            BlogPost(
                title=SAMPLE_BLOG["title"],
                slug=SAMPLE_BLOG["slug"],
                category=SAMPLE_BLOG["category"],
                excerpt=SAMPLE_BLOG["excerpt"],
                content=SAMPLE_BLOG["content"],
                publish_date=datetime.now(timezone.utc),
                status=SAMPLE_BLOG["status"],
            )
        )
        results["blog_posts"] = "created"
    else:
        results["blog_posts"] = "skipped"

    if db.query(Article).count() == 0:
        db.add(
            Article(
                title=SAMPLE_ARTICLE["title"],
                slug=SAMPLE_ARTICLE["slug"],
                abstract=SAMPLE_ARTICLE["abstract"],
                content=SAMPLE_ARTICLE["content"],
                article_type=SAMPLE_ARTICLE["article_type"],
                year=SAMPLE_ARTICLE["year"],
                language=SAMPLE_ARTICLE["language"],
                authors=SAMPLE_ARTICLE["authors"],
                source=SAMPLE_ARTICLE["source"],
                tags=SAMPLE_ARTICLE["tags"],
                status=SAMPLE_ARTICLE["status"],
                published_at=datetime.now(timezone.utc),
            )
        )
        results["articles"] = "created"
    else:
        results["articles"] = "skipped"

    db.commit()
    return results


if __name__ == "__main__":
    from app.core.database import SessionLocal

    db = SessionLocal()
    try:
        result = seed_sample_content_if_empty(db)
        print("Sample content seed:", result)
    finally:
        db.close()
