from __future__ import annotations

import os
from typing import Any

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.seeds.seed_about_sections import seed_about_sections_if_empty
from app.seeds.seed_admin import DEFAULT_ADMIN_EMAIL, seed_admin_user_if_empty
from app.seeds.seed_pages import seed_cms_pages_if_empty
from app.seeds.seed_sample_content import seed_sample_content_if_empty


def run_all_seeds(db: Session) -> dict[str, Any]:
    """Run all idempotent seeds. Each step only inserts when its table is empty."""
    results: dict[str, Any] = {}

    results["admin_user"] = seed_admin_user_if_empty(db)
    results["about_sections"] = seed_about_sections_if_empty(db)
    results.update(seed_cms_pages_if_empty(db))
    results["sample_content"] = seed_sample_content_if_empty(db)

    return results


def _format_results(results: dict[str, Any]) -> list[str]:
    lines: list[str] = []

    admin_result = results.get("admin_user")
    if admin_result == "created":
        email = os.getenv("ADMIN_EMAIL", DEFAULT_ADMIN_EMAIL).strip()
        lines.append(f"admin_user: created ({email})")
        if not os.getenv("ADMIN_PASSWORD"):
            lines.append("  → default password in use; set ADMIN_PASSWORD in production")
    else:
        lines.append(f"admin_user: {admin_result}")

    for key in ("about_sections", "pages", "page_sections"):
        lines.append(f"{key}: {results.get(key, 'skipped')}")

    sample = results.get("sample_content", {})
    if isinstance(sample, dict):
        for key, value in sample.items():
            lines.append(f"{key}: {value}")
    else:
        lines.append(f"sample_content: {sample}")

    return lines


def main() -> None:
    db = SessionLocal()
    try:
        results = run_all_seeds(db)
        print("Seed complete (idempotent):")
        for line in _format_results(results):
            print(f"  {line}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
