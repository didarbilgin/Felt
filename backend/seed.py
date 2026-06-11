#!/usr/bin/env python3
"""Populate a fresh database with default admin, CMS content, and sample entries.

Usage (from the backend directory):

    alembic upgrade head
    python seed.py

Environment variables:
    ADMIN_EMAIL     — first admin email (default: admin@felt.com)
    ADMIN_PASSWORD  — first admin password (default: felt-admin)
"""

from app.seeds.run import main

if __name__ == "__main__":
    main()
