# Güncel Veritabanı Şeması

Veritabanı PostgreSQL üzerinde çalışmaktadır. Şema yönetimi Alembic migration dosyaları ile yapılmaktadır.

## 1. admin_users

Admin panel kullanıcılarını tutar.

| Alan | Tip | Açıklama |
|---|---|---|
| id | UUID | Birincil anahtar |
| email | String(255) | Admin e-posta adresi, unique index |
| password_hash | String(255) | Şifre hash değeri |
| role | String(50) | Kullanıcı rolü |
| created_at | DateTime(timezone=True) | Oluşturulma tarihi |
| updated_at | DateTime(timezone=True) | Güncellenme tarihi |

---

## 2. articles

Araştırma/yayın içeriklerini tutar.

| Alan | Tip | Açıklama |
|---|---|---|
| id | UUID | Birincil anahtar |
| title | String(255) | Makale başlığı |
| slug | String(255) | URL slug değeri, unique index |
| content | Text | Makale içeriği |
| status | String(20) | Yayın durumu |
| published_at | DateTime(timezone=True) | Yayınlanma tarihi |
| created_at | DateTime(timezone=True) | Oluşturulma tarihi |
| updated_at | DateTime(timezone=True) | Güncellenme tarihi |
| abstract | Text | Özet/abstract alanı |
| article_type | String(50) | İçerik türü |
| year | Integer | Yayın yılı |
| language | String(10) | İçerik dili |
| source | String(255) | Kaynak bilgisi |
| tags | JSON | Etiket listesi |
| link | String(500) | Harici bağlantı |
| doi | String(255) | DOI bilgisi |
| authors | String(500) | Yazar bilgileri |
| cover_image | String(500) | Kapak görseli bağlantısı |
| pdf_link | String(500) | PDF bağlantısı |
| detail_description | Text | Ek detay açıklaması |

Not: summary alanı migration ile kaldırılmıştır.

---

## 3. programs

| Alan | Tip |
|---|---|
| id | UUID |
| title | String(255) |
| category | String(50) |
| target_audience | String(255) |
| description | Text |
| duration | String(100) |
| status | String(20) |
| created_at | DateTime |
| updated_at | DateTime |
| detail_description | Text |
| link | String(500) |

---

## 4. events

| Alan | Tip |
|---|---|
| id | UUID |
| title | String(255) |
| type | String(50) |
| date | DateTime |
| location | String(255) |
| description | Text |
| link | String(500) |
| created_at | DateTime |
| updated_at | DateTime |
| status | String(20) |
| detail_description | Text |

---

## 5. blog_posts

| Alan | Tip |
|---|---|
| id | UUID |
| title | String(255) |
| slug | String(255) |
| category | String(50) |
| content | Text |
| excerpt | Text |
| publish_date | DateTime |
| status | String(20) |
| created_at | DateTime |
| updated_at | DateTime |
| detail_description | Text |
| link | String(500) |

---

## 6. contact_messages

| Alan | Tip |
|---|---|
| id | UUID |
| name | String(255) |
| email | String(255) |
| subject | String(100) |
| message | Text |
| created_at | DateTime |

---

## 7. newsletter_subscriptions

| Alan | Tip |
|---|---|
| id | UUID |
| email | String(255) |
| created_at | DateTime |

---

## 8. about_sections

| Alan | Tip |
|---|---|
| id | UUID |
| section_key | String(100) |
| title | String(255) |
| content | Text |
| items | JSON |
| sort_order | Integer |
| is_active | Boolean |
| created_at | DateTime |
| updated_at | DateTime |

---

## 9. pages

| Alan | Tip |
|---|---|
| id | UUID |
| page_key | String(100) |
| title | String(255) |
| subtitle | Text |
| slug | String(255) |
| is_active | Boolean |
| sort_order | Integer |
| created_at | DateTime |
| updated_at | DateTime |

---

## 10. page_sections

| Alan | Tip |
|---|---|
| id | UUID |
| page_key | String(100) |
| section_key | String(100) |
| section_type | String(50) |
| title | String(255) |
| subtitle | Text |
| content | Text |
| items | JSON |
| sort_order | Integer |
| is_active | Boolean |
| created_at | DateTime |
| updated_at | DateTime |

Ek kısıt: page_key + section_key unique.

---

## 11. applications

| Alan | Tip |
|---|---|
| id | UUID |
| source_type | String(32) |
| source_id | UUID |
| source_title | String(500) |
| full_name | String(255) |
| email | String(255) |
| phone | String(64) |
| organization | String(255) |
| title | String(255) |
| message | Text |
| status | String(32) |
| created_at | DateTime |

### Indexler

- source_type
- source_id
- email
- status
- created_at

## Kurulum

```bash
cd backend
alembic upgrade head
```

Bu komut tüm migration dosyalarını çalıştırarak güncel tablo yapısını oluşturur.
