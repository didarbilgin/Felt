# Database seeding

Idempotent seeds for fresh FELT installations. Each step checks whether its target table already has rows; if so, it skips without modifying data.

## Quick start

From the `backend/` directory:

```bash
# 1. Apply migrations
alembic upgrade head

# 2. Seed default data
python seed.py
```

Or run the module directly:

```bash
python -m app.seeds.run
```

## What gets created

| Step | Table(s) | When |
|------|----------|------|
| Admin user | `admin_users` | Only when no admin users exist |
| About CMS | `about_sections` | Only when table is empty |
| Pages CMS | `pages` | Only when table is empty |
| Page sections | `page_sections` | Only when table is empty |
| Sample program | `programs` | Only when table is empty |
| Sample event | `events` | Only when table is empty |
| Sample blog post | `blog_posts` | Only when table is empty |
| Sample article | `articles` | Only when table is empty |

Re-running `python seed.py` is safe: existing data is never overwritten or duplicated.

## Environment variables

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-in-production
```

If `ADMIN_EMAIL` / `ADMIN_PASSWORD` are not set, defaults are used for the **first** admin only (`admin@felt.com` / `felt-admin`). Change these before seeding production.

## Individual seed modules

```bash
python -m app.seeds.seed_admin
python -m app.seeds.seed_about_sections
python -m app.seeds.seed_pages
python -m app.seeds.seed_sample_content
```

## After seeding

- Log in at `/admin` with the admin credentials above.
- Public pages should show CMS structure (home, programs, events, blog, research, etc.).
- One sample program, event, blog post, and article are published/active for demo purposes.
- Edit or delete sample content from the admin panel at any time.
