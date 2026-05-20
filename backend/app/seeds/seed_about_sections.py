from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.about_section import AboutSection

ABOUT_SECTIONS = [
    {
        "section_key": "founder",
        "title": "Kurucunun Mesajı",
        "content": None,
        "items": [
            {
                "number": "1.1",
                "title": "Kurucunun Mesajı",
                "content": """Değerli okuyucular,

Eğitim, her zaman toplumların geleceğini şekillendiren en güçlü araç olmuştur. Ancak bugün, hiç olmadığı kadar hızlı değişen bir dünyada yaşıyoruz. Yapay zeka, dijital dönüşüm ve küresel zorluklar, eğitimi yeniden düşünmemizi gerektiriyor.

FELT, bu dönüşümün merkezinde yer almak için kuruldu. Amacımız, geleceğin eğitim liderlerini yetiştirmek, yenilikçi araştırmalar üretmek ve eğitim sistemlerinin dönüşümüne öncülük etmektir.

Birlikte, eğitimin geleceğini şekillendirebiliriz.

Dr. Hümeyra Kalafat
FELT Kurucusu"""
            }
        ],
        "sort_order": 1,
        "is_active": True,
    },
    {
        "section_key": "what-is-felt",
        "title": "FELT Nedir?",
        "content": None,
        "items": [
            {
                "number": "2.1",
                "title": "Misyon",
                "content": "Eğitimin, liderliğin ve teknolojinin geleceğini araştırmak, anlamak ve şekillendirmek için çalışan bir akademik platform olmak."
            },
            {
                "number": "2.2",
                "title": "Vizyon",
                "content": "2040 yılına kadar, dünya genelinde eğitim sistemlerinin dönüşümüne öncülük eden referans kuruluş olmak."
            },
            {
                "number": "2.3",
                "title": "Felsefe",
                "content": "İnsan merkezli, etik değerlere bağlı, teknoloji destekli ve gelecek odaklı bir eğitim anlayışı."
            },
        ],
        "sort_order": 2,
        "is_active": True,
    },
    {
        "section_key": "manifesto",
        "title": "Manifesto",
        "content": None,
        "items": [
            {
                "number": "3.1",
                "title": "Manifesto Alıntısı",
                "content": "Geleceğin eğitimi, bugünün hayal gücüyle şekillenir. Biz, eğitimin sınırlarını genişleten, teknolojiyi insanlığın hizmetine sunan ve her öğrencinin potansiyelini açığa çıkaran bir dünya için çalışıyoruz."
            },
            {
                "number": "3.2",
                "title": "Manifesto Açıklaması",
                "content": "FELT olarak, eğitimin sadece bilgi aktarımı değil, insanın bütüncül gelişimi olduğuna inanıyoruz. Teknoloji bir araçtır, amaç değil."
            },
            {
                "number": "3.3",
                "title": "Liderlik Yaklaşımı",
                "content": "Gelecekçi liderlik, belirsizliği kucaklayan, etik değerlere bağlı kalan ve sürekli öğrenen bir liderlik anlayışıdır."
            },
        ],
        "sort_order": 3,
        "is_active": True,
    },
    {
        "section_key": "values",
        "title": "Değerler ve İlkeler",
        "content": None,
        "items": [
            {"number": "4.1", "title": "İnsan Merkezlilik", "content": "Her kararımızın merkezinde insan var."},
            {"number": "4.2", "title": "Etik ve Dürüstlük", "content": "Araştırma ve eğitimde en yüksek etik standartlar."},
            {"number": "4.3", "title": "Yenilikçilik", "content": "Sürekli öğrenme ve gelişim kültürü."},
            {"number": "4.4", "title": "İş Birliği", "content": "Küresel ortaklıklar ve topluluk gücü."},
            {"number": "4.5", "title": "Kapsayıcılık", "content": "Herkes için erişilebilir eğitim fırsatları."},
            {"number": "4.6", "title": "Sürdürülebilirlik", "content": "Gelecek nesillere karşı sorumluluk."},
        ],
        "sort_order": 4,
        "is_active": True,
    },
    {
        "section_key": "roadmap",
        "title": "Stratejik Yol Haritası 2025–2030",
        "content": None,
        "items": [
            {"number": "5.1", "title": "2025", "content": "Platform lansmanı ve ilk sertifika programları"},
            {"number": "5.2", "title": "2026", "content": "FELT Summit ve uluslararası ortaklıklar"},
            {"number": "5.3", "title": "2027", "content": "FELT Lab projelerinin genişletilmesi"},
            {"number": "5.4", "title": "2028", "content": "Model okul programının pilot uygulaması"},
            {"number": "5.5", "title": "2029", "content": "Küresel topluluk ağının 50.000 üyeye ulaşması"},
            {"number": "5.6", "title": "2030", "content": "10 ülkede FELT Model Okulları"},
        ],
        "sort_order": 5,
        "is_active": True,
    },
    {
        "section_key": "research-areas",
        "title": "Araştırma Alanları",
        "content": None,
        "items": [
            {
                "number": "6.1",
                "title": "Geleceğin Eğitimi",
                "content": "Eğitim sistemlerinin geleceğe nasıl hazırlanabileceğini araştırır."
            },
            {
                "number": "6.2",
                "title": "Eğitimde Yapay Zeka",
                "content": "Yapay zekanın eğitim süreçlerindeki etik, pedagojik ve stratejik kullanım alanlarını inceler."
            },
            {
                "number": "6.3",
                "title": "Liderlik ve Dönüşüm",
                "content": "Eğitim liderlerinin değişen dünyaya uyum sağlayabilmesi için yeni liderlik modellerini ele alır."
            },
        ],
        "sort_order": 6,
        "is_active": True,
    },
]


def seed_about_sections(db: Session):
    for section_data in ABOUT_SECTIONS:
        existing = (
            db.query(AboutSection)
            .filter(AboutSection.section_key == section_data["section_key"])
            .first()
        )

        if existing:
            existing.title = section_data["title"]
            existing.content = section_data["content"]
            existing.items = section_data["items"]
            existing.sort_order = section_data["sort_order"]
            existing.is_active = section_data["is_active"]
        else:
            section = AboutSection(**section_data)
            db.add(section)

    db.commit()


if __name__ == "__main__":
    db = SessionLocal()

    try:
        seed_about_sections(db)
        print("About sections seeded successfully.")
    finally:
        db.close()