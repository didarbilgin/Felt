# FELT Database Schema

Generated from PostgreSQL schema inspection.

- Database: `felt`
- Schema: `public`
- Owner: `felt`

---

# Tables

```text
public
├── admin_users
├── alembic_version
├── articles
├── blog_posts
├── contact_messages
├── events
├── newsletter_subscriptions
└── programs
```

---

# 1. admin_users

## Purpose
Admin kullanıcılarını tutar.  
JWT authentication işlemleri bu tablo üzerinden yapılır.

## Columns

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | NO | - | Primary Key |
| email | varchar(255) | NO | - | Unique |
| password_hash | varchar(255) | NO | - | Hashed password |
| role | varchar(50) | NO | - | Admin role |
| created_at | timestamptz | NO | now() | Creation timestamp |
| updated_at | timestamptz | NO | now() | Update timestamp |

## Indexes

| Name | Type |
|---|---|
| admin_users_pkey | PRIMARY KEY (id) |
| ix_admin_users_email | UNIQUE (email) |

---

# 2. alembic_version

## Purpose
Alembic migration versiyon bilgisini tutar.  
Sistem tablosudur.

## Columns

| Column | Type | Nullable | Notes |
|---|---|---|---|
| version_num | varchar(32) | NO | Primary Key |

## Indexes

| Name | Type |
|---|---|
| alembic_version_pkc | PRIMARY KEY (version_num) |

---

# 3. articles

## Purpose
Makale, yayın ve araştırma içeriklerini tutar.  
Admin panelinden girilen araştırma/yayın içerikleri burada saklanır ve public Research sayfasına buradan yansıtılır.

## Columns

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | NO | - | Primary Key |
| title | varchar(255) | NO | - | Article title |
| slug | varchar(255) | NO | - | Unique technical URL slug, generated from title |
| article_type | varchar(50) | NO | `article` | Article category/type |
| year | integer | NO | 2026 | Publication/display year |
| language | varchar(10) | NO | `TR` | Content language |
| source | varchar(255) | YES | - | Source / institution / publisher |
| tags | json | NO | `[]` | Tag list as JSON array |
| abstract | text | YES | - | Short abstract/summary shown in cards |
| content | text | NO | - | Full article content |
| link | varchar(500) | YES | - | Optional external link, currently not filled from admin form |
| doi | varchar(255) | YES | - | Optional DOI, currently not filled from admin form |
| status | varchar(20) | NO | - | draft / published |
| published_at | timestamptz | YES | - | Publish timestamp |
| created_at | timestamptz | NO | now() | Creation timestamp |
| updated_at | timestamptz | NO | now() | Update timestamp |

## Indexes

| Name | Type |
|---|---|
| articles_pkey | PRIMARY KEY (id) |
| ix_articles_slug | UNIQUE (slug) |

## Notes

- `slug` is a technical field and should not be filled manually by the admin user.
- `tags` is stored as JSON array. Turkish characters may appear escaped in raw JSON view, but the actual value is valid.
- `link` and `doi` are nullable and kept for possible future advanced usage.
- `abstract` replaced the old `summary` concept.
- The old `summary` column has been removed.

---

# 4. blog_posts

## Purpose
Blog yazılarını tutar.

## Columns

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | NO | - | Primary Key |
| title | varchar(255) | NO | - | Blog title |
| slug | varchar(255) | NO | - | Unique URL slug |
| category | varchar(50) | NO | - | Blog category |
| content | text | NO | - | Full content |
| excerpt | text | NO | - | Short excerpt |
| publish_date | timestamptz | NO | - | Publish date |
| status | varchar(20) | NO | - | draft / published |
| created_at | timestamptz | NO | now() | Creation timestamp |
| updated_at | timestamptz | NO | now() | Update timestamp |

## Indexes

| Name | Type |
|---|---|
| blog_posts_pkey | PRIMARY KEY (id) |
| ix_blog_posts_slug | UNIQUE (slug) |

---

# 5. contact_messages

## Purpose
İletişim formundan gelen mesajları tutar.

## Columns

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | NO | - | Primary Key |
| name | varchar(255) | NO | - | Sender name |
| email | varchar(255) | NO | - | Sender email |
| subject | varchar(100) | NO | - | Message subject |
| message | text | NO | - | Message body |
| created_at | timestamptz | NO | now() | Creation timestamp |

## Indexes

| Name | Type |
|---|---|
| contact_messages_pkey | PRIMARY KEY (id) |

---

# 6. events

## Purpose
Etkinlik kayıtlarını tutar.

## Columns

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | NO | - | Primary Key |
| title | varchar(255) | NO | - | Event title |
| type | varchar(50) | NO | - | Event type |
| date | timestamptz | NO | - | Event date |
| location | varchar(255) | NO | - | Event location |
| description | text | NO | - | Event description |
| link | varchar(500) | YES | - | Optional event link |
| created_at | timestamptz | NO | now() | Creation timestamp |
| updated_at | timestamptz | NO | now() | Update timestamp |

## Indexes

| Name | Type |
|---|---|
| events_pkey | PRIMARY KEY (id) |

---

# 7. newsletter_subscriptions

## Purpose
Newsletter aboneliklerini tutar.

## Columns

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | NO | - | Primary Key |
| email | varchar(255) | NO | - | Unique subscriber email |
| created_at | timestamptz | NO | now() | Subscription timestamp |

## Indexes

| Name | Type |
|---|---|
| newsletter_subscriptions_pkey | PRIMARY KEY (id) |
| ix_newsletter_subscriptions_email | UNIQUE (email) |

---

# 8. programs

## Purpose
Program/eğitim/modül kayıtlarını tutar.

## Columns

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| id | uuid | NO | - | Primary Key |
| title | varchar(255) | NO | - | Program title |
| category | varchar(50) | NO | - | Program category |
| target_audience | varchar(255) | NO | - | Target audience |
| description | text | NO | - | Program description |
| duration | varchar(100) | NO | - | Program duration |
| status | varchar(20) | NO | - | draft / active |
| created_at | timestamptz | NO | now() | Creation timestamp |
| updated_at | timestamptz | NO | now() | Update timestamp |

## Indexes

| Name | Type |
|---|---|
| programs_pkey | PRIMARY KEY (id) |

---

# System Overview

## Admin Protected Tables

```text
admin_users
├── articles
├── blog_posts
├── programs
└── events
```

These tables are managed through JWT-protected admin endpoints.

## Public Input Tables

```text
contact_messages
└── newsletter_subscriptions
```

These tables receive data from public forms.

## Migration Table

```text
alembic_version
```

Stores the current Alembic migration state.

---

# Notes

- UUID is used as the primary key strategy across all business tables.
- PostgreSQL is used as the primary relational database.
- Alembic handles schema migrations.
- FastAPI + SQLAlchemy backend architecture is used.
- Frontend communicates through JWT Bearer authentication.
- Articles now use `abstract` instead of the removed legacy `summary` field.
- Article `slug`, `id`, `created_at`, `updated_at`, and `published_at` are system-managed fields.
