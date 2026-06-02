from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.page import Page, PageSection

PAGES = [
    {
        "page_key": "home",
        "title": "Ana Sayfa",
        "subtitle": None,
        "slug": "/",
        "sort_order": 1,
    },
    {
        "page_key": "research",
        "title": "Araştırma & Yayınlar",
        "subtitle": "Eğitim, liderlik ve teknoloji alanlarındaki akademik çalışmalarımız",
        "slug": "/research",
        "sort_order": 2,
    },
    {
        "page_key": "programs",
        "title": "Programlar",
        "subtitle": "Eğitimciler, yöneticiler ve topluluklar için tasarlanmış profesyonel gelişim programları",
        "slug": "/programs",
        "sort_order": 3,
    },
    {
        "page_key": "lab",
        "title": "FELT Lab",
        "subtitle": "Eğitimin geleceğini araştıran, deneyen ve tasarlayan inovasyon laboratuvarı",
        "slug": "/lab",
        "sort_order": 4,
    },
    {
        "page_key": "events",
        "title": "Etkinlikler",
        "subtitle": "Summit, webinar ve topluluk buluşmaları",
        "slug": "/events",
        "sort_order": 5,
    },
    {
        "page_key": "community",
        "title": "FELT Topluluğu",
        "subtitle": "Eğitimin geleceğini birlikte şekillendiren küresel bir araştırma ve düşünce ağı",
        "slug": "/community",
        "sort_order": 6,
    },
    {
        "page_key": "blog",
        "title": "Blog / Perspektif",
        "subtitle": "Eğitimin geleceğine dair düşünceler, analizler ve içgörüler",
        "slug": "/blog",
        "sort_order": 7,
    },
    {
        "page_key": "contact",
        "title": "İletişim",
        "subtitle": "Önerileriniz, görüşleriniz ve mesajlarınız için bize yazın",
        "slug": "/contact",
        "sort_order": 8,
    },
    {
        "page_key": "footer",
        "title": "Alt Bilgi",
        "subtitle": None,
        "slug": None,
        "sort_order": 9,
    },
]

SECTIONS = [
    # --- Home ---
    {
        "page_key": "home",
        "section_key": "hero",
        "section_type": "hero",
        "title": "Eğitim, Liderlik ve Teknolojinin Geleceği",
        "subtitle": "Eğitimin geleceği bugün şekilleniyor.",
        "content": "Yapay zekâ, etik, liderlik ve insan öğrenmesi üzerine araştırma ve düşünce üretiyoruz.\n\nFELT, yapay zekâ çağının eğitim, etik ve insanlık düzeyindeki dönüşümüne yanıt veren bir düşünce ve araştırma ağıdır.",
        "items": None,
        "sort_order": 1,
    },
    {
        "page_key": "home",
        "section_key": "manifesto",
        "section_type": "quote",
        "title": None,
        "subtitle": "Bir düşünce platformu, araştırma ağı ve gelecek odaklı eğitim enstitüsü.",
        "content": "FELT, eğitim sistemlerinin, liderlerin ve öğrenenlerin yapay zekâ çağının etik, teknolojik ve insani zorluklarına nasıl yanıt verebileceğini araştırır.",
        "items": None,
        "sort_order": 2,
    },
    {
        "page_key": "home",
        "section_key": "hubs",
        "section_type": "cards",
        "title": "Büyüyen Araştırma Ekosistemi",
        "subtitle": "FELT, eğitim, teknoloji ve insan odaklı dönüşüm üzerine düşünen araştırmacıları, eğitimcileri ve liderleri bir araya getiren gelişen bir araştırma ekosistemidir. Hub'lar, circle'lar ve lab'lar; düşünce topluluklarını, okuma gruplarını ve ortak araştırma süreçlerini destekler.",
        "content": None,
        "items": [
            {"title": "Yapay Zeka ve Pedagoji Çemberi", "subtitle": "Çember", "content": "Yapay zekanın pedagojik ve etik sınırlarını okuma grupları ve tartışma serileriyle araştırır."},
            {"title": "İnsan Gelecekleri Laboratuvarı", "subtitle": "Laboratuvar", "content": "İnsan merkezli gelecek senaryoları, değerler ve öğrenme modelleri üzerine deneysel çalışmalar."},
            {"title": "Post-Dijital Öğrenme Merkezi", "subtitle": "Merkez", "content": "Post-dijital çağda öğrenme, liderlik ve kurum dönüşümüne dair araştırma ve perspektifler."},
            {"title": "Gelecek Okuryazarlığı Okuma Grubu", "subtitle": "Grup", "content": "Gelecek okuryazarlığı ve eğitim felsefesi üzerine çevrimiçi okuma ve yorum toplulukları."},
        ],
        "sort_order": 3,
    },
    {
        "page_key": "home",
        "section_key": "ecosystem",
        "section_type": "text",
        "title": "Büyüyen Ekosistem",
        "subtitle": None,
        "content": "FELT, eğitim, teknoloji ve insan odaklı dönüşüm üzerine düşünen araştırmacıları, eğitimcileri ve liderleri bir araya getiren büyüyen bir araştırma ekosistemidir. Hub'lar, circle'lar ve lab'lar; düşünce topluluklarını, okuma gruplarını ve ortak araştırma süreçlerini destekler.",
        "items": [
            {"title": "Çevrimiçi okuma grupları"},
            {"title": "Üç aylık araştırma notları"},
            {"title": "Fellow programları"},
            {"title": "Araştırma toplulukları"},
        ],
        "sort_order": 4,
    },
    {
        "page_key": "home",
        "section_key": "highlights",
        "section_type": "text",
        "title": "Öne Çıkanlar",
        "subtitle": "Güncel araştırmalar, programlar ve perspektifler",
        "content": None,
        "items": [
            {"title": "Son Yayın", "subtitle": "Akademik Araştırma"},
            {"title": "Aktif Program", "subtitle": "Eğitim & Gelişim"},
            {"title": "FELT Lab", "subtitle": "İnovasyon & Deneyler", "content": "Yapay Zeka & Eğitim Araştırmaları\n2040-2050 gelecek senaryoları ve prototip projeler"},
        ],
        "sort_order": 5,
    },
    {
        "page_key": "home",
        "section_key": "blog-preview",
        "section_type": "text",
        "title": "Blog / Perspektif",
        "subtitle": "Eğitimin geleceğine dair düşünceler ve analizler",
        "content": None,
        "sort_order": 6,
    },
    {
        "page_key": "home",
        "section_key": "network-cta",
        "section_type": "cta",
        "title": "FELT Topluluğuna Katılın",
        "subtitle": "Eğitimin geleceğini birlikte düşünmek ve araştırmak için topluluğumuza davetlisiniz.",
        "content": "FELT Topluluğu",
        "items": [
            {"title": "İş birlikleri"},
            {"title": "Araştırma çevreleri"},
            {"title": "Fellows"},
        ],
        "sort_order": 7,
    },
    # --- Research ---
    {
        "page_key": "research",
        "section_key": "article-tabs",
        "section_type": "labels",
        "title": None,
        "subtitle": None,
        "content": None,
        "items": [
            {"title": "all", "content": "Tümü"},
            {"title": "article", "content": "Akademik Makaleler"},
            {"title": "conference", "content": "Kongre & Sunumlar"},
            {"title": "report", "content": "Raporlar"},
            {"title": "book", "content": "Kitaplar"},
            {"title": "scale", "content": "Veri ve Ölçekler"},
        ],
        "sort_order": 1,
    },
    {
        "page_key": "research",
        "section_key": "ui-labels",
        "section_type": "labels",
        "title": None,
        "subtitle": None,
        "content": None,
        "items": [
            {"title": "language_filter", "content": "Dil:"},
            {"title": "language_all", "content": "Tümü"},
            {"title": "language_tr", "content": "Türkçe"},
            {"title": "language_en", "content": "İngilizce"},
            {"title": "empty", "content": "Bu kategoride yayın bulunamadı."},
            {"title": "loading", "content": "Yükleniyor..."},
        ],
        "sort_order": 2,
    },
    # --- Programs ---
    {
        "page_key": "programs",
        "section_key": "program-tabs",
        "section_type": "labels",
        "items": [
            {"title": "all", "content": "Tümü"},
            {"title": "education-module", "content": "Eğitim Modülleri"},
            {"title": "mentorship", "content": "Mentorluk"},
            {"title": "certificate", "content": "Sertifika"},
            {"title": "transformation-package", "content": "Dönüşüm Paketleri"},
        ],
        "sort_order": 1,
    },
    {
        "page_key": "programs",
        "section_key": "cta",
        "section_type": "cta",
        "title": "Kurumunuz için Özel Program",
        "subtitle": "Okul, üniversite veya kurumunuza özel eğitim ve dönüşüm programları tasarlıyoruz.",
        "content": "İletişime geçin",
        "sort_order": 2,
    },
    # --- Lab ---
    {
        "page_key": "lab",
        "section_key": "lab-sections",
        "section_type": "cards",
        "subtitle": "Prototip / araştırma projesi",
        "items": [
            {
                "title": "Yapay Zeka & Eğitim",
                "content": "Yapay zekanın eğitimde kullanımına yönelik araştırmalar ve uygulamalar",
                "subtitle": "Kişiselleştirilmiş Öğrenme Asistanı Prototipi\nAI Destekli Değerlendirme Sistemleri\nÖğretmen için AI Okuryazarlığı Araç Seti",
            },
            {
                "title": "Metaverse, VR ve XR Uygulamaları",
                "content": "Sanal ve artırılmış gerçeklik teknolojileriyle eğitim deneyimleri",
                "subtitle": "Sanal Sınıf Ortamı Tasarımı\nVR Tarih Müzesi Deneyimi\nXR Fen Laboratuvarı Simülasyonu",
            },
            {
                "title": "Gelecek Senaryoları (2040–2050)",
                "content": "Eğitimin geleceğine dair senaryolar ve stratejik öngörüler",
                "subtitle": "2040 Eğitim Senaryoları Raporu\nGelecek Okuryazarlığı Çerçevesi\nDelphi Çalışması: Eğitimin Geleceği",
            },
            {
                "title": "Eğitim İnovasyon Projeleri",
                "content": "Yenilikçi eğitim modelleri ve pilot uygulamalar",
                "subtitle": "Proje Tabanlı Öğrenme Modeli\nÇok Kuşaklı Öğrenme Programı\nSürdürülebilirlik Eğitimi Müfredatı",
            },
            {
                "title": "Prototip Öğrenme Ortamları",
                "content": "Geleceğin okullarını bugünden tasarlama çalışmaları",
                "subtitle": "FELT Model Okul Konsepti\nEsnek Öğrenme Mekanları Tasarımı\nTopluluk Tabanlı Öğrenme Merkezi",
            },
        ],
        "sort_order": 2,
    },
    # --- Events ---
    {
        "page_key": "events",
        "section_key": "event-tabs",
        "section_type": "labels",
        "items": [
            {"title": "upcoming", "content": "Yaklaşan"},
            {"title": "past", "content": "Geçmiş"},
            {"title": "all", "content": "Tümü"},
            {"title": "summit", "content": "Zirve"},
            {"title": "webinar", "content": "Çevrimiçi Seminer"},
            {"title": "podcast", "content": "Podcast"},
        ],
        "sort_order": 1,
    },
    {
        "page_key": "events",
        "section_key": "highlight",
        "section_type": "text",
        "title": "Aktif Etkinlikler",
        "subtitle": "Yaklaşan etkinliklerimizi keşfedin ve FELT topluluğuyla buluşun",
        "sort_order": 2,
    },
    # --- Community (network-intro removed — not rendered on site) ---
    {
        "page_key": "community",
        "section_key": "contributor-types",
        "section_type": "cards",
        "title": "Katılım Alanları",
        "subtitle": "FELT Network'e farklı rollerle katılın",
        "items": [
            {"title": "Öğrenciler", "content": "Lisans, yüksek lisans ve doktora öğrencileri", "items": ["Ücretsiz webinar erişimi", "Kaynak kütüphanesi", "Mentorluk fırsatları"]},
            {"title": "Akademisyenler", "content": "Araştırmacılar ve akademik personel", "items": ["Araştırma iş birliği", "Yayın fırsatları", "Konferans indirimleri"]},
            {"title": "Okullar", "content": "K-12 okulları ve eğitim kurumları", "items": ["Kurumsal danışmanlık", "Öğretmen gelişimi", "FELT Model erişimi"]},
            {"title": "Araştırmacılar", "content": "Bağımsız araştırmacılar ve think-tank'ler", "items": ["Veri paylaşımı", "Ortak projeler", "Yayın platformu"]},
        ],
        "sort_order": 2,
    },
    {
        "page_key": "community",
        "section_key": "research-circles",
        "section_type": "cards",
        "title": "Araştırma Çevreleri",
        "subtitle": "İlgi alanlarınıza göre çalışma gruplarına katılın",
        "items": [
            {"title": "Future Literacy Circle", "content": "Gelecek okuryazarlığı üzerine okuma ve tartışma grubu"},
            {"title": "Liderlik & Değerler Hub", "content": "Eğitim liderliği ve değerler eğitimi çalışma grubu"},
            {"title": "Teknoloji & Etik Forumu", "content": "Eğitim teknolojileri ve etik tartışmalar platformu"},
        ],
        "sort_order": 3,
    },
    {
        "page_key": "community",
        "section_key": "cta",
        "section_type": "cta",
        "title": "FELT Topluluğuna Katıl",
        "subtitle": "Etkinliklere katılın, research circle'lara dahil olun ve eğitimin geleceğini birlikte şekillendirin.",
        "sort_order": 4,
    },
    # --- Blog ---
    {
        "page_key": "blog",
        "section_key": "blog-tabs",
        "section_type": "labels",
        "items": [
            {"title": "all", "content": "Tümü"},
            {"title": "essay", "content": "Deneme"},
            {"title": "future-notes", "content": "Gelecek Notları"},
            {"title": "video-podcast-notes", "content": "Video & Podcast"},
            {"title": "weekly-insight", "content": "Haftalık İçgörü"},
        ],
        "sort_order": 1,
    },
    {
        "page_key": "blog",
        "section_key": "newsletter",
        "section_type": "text",
        "title": "Bülten",
        "subtitle": "Haftalık içgörüler ve yeni yayınlardan haberdar olun",
        "content": "E-posta adresinizi bırakın",
        "sort_order": 2,
    },
    # --- Contact ---
    {
        "page_key": "contact",
        "section_key": "contact-info",
        "section_type": "text",
        "items": [
            {"title": "E-posta", "content": "info@felt.org"},
            {"title": "Konum", "content": "İstanbul, Türkiye"},
        ],
        "sort_order": 1,
    },
    # --- Footer ---
    {
        "page_key": "footer",
        "section_key": "brand",
        "section_type": "text",
        "title": "FELT",
        "content": "Futures of Education, Leadership & Technology — Eğitimin, liderliğin ve teknolojinin geleceğini şekillendiren araştırma ve eğitim platformu.",
        "sort_order": 1,
    },
    {
        "page_key": "footer",
        "section_key": "copyright",
        "section_type": "text",
        "content": "© FELT. Tüm hakları saklıdır.",
        "sort_order": 2,
    },
]


def _upsert_page(db: Session, data: dict) -> Page:
    page = db.query(Page).filter(Page.page_key == data["page_key"]).first()
    if page:
        for key, value in data.items():
            setattr(page, key, value)
        page.is_active = True
    else:
        page = Page(**data, is_active=True)
        db.add(page)
    return page


def _upsert_section(db: Session, data: dict) -> None:
    section = (
        db.query(PageSection)
        .filter(
            PageSection.page_key == data["page_key"],
            PageSection.section_key == data["section_key"],
        )
        .first()
    )
    payload = {
        "page_key": data["page_key"],
        "section_key": data["section_key"],
        "section_type": data.get("section_type", "text"),
        "title": data.get("title"),
        "subtitle": data.get("subtitle"),
        "content": data.get("content"),
        "items": data.get("items"),
        "sort_order": data.get("sort_order", 0),
        "is_active": data.get("is_active", True),
    }
    if section:
        for key, value in payload.items():
            setattr(section, key, value)
    else:
        db.add(PageSection(**payload))


def seed_pages(db: Session):
    for page_data in PAGES:
        _upsert_page(db, page_data)

    for section_data in SECTIONS:
        _upsert_section(db, section_data)

    # Retired sections — keep DB rows but never show on site or in admin
    for retired_key in ("network-intro", "intro"):
        db.query(PageSection).filter(PageSection.section_key == retired_key).update(
            {"is_active": False},
            synchronize_session=False,
        )

    db.commit()


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_pages(db)
        print("Pages CMS seeded successfully.")
    finally:
        db.close()
