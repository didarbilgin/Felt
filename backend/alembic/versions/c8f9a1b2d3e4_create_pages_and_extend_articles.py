"""create pages cms and extend articles

Revision ID: c8f9a1b2d3e4
Revises: 7ec4f4be0e8a
Create Date: 2026-05-19 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c8f9a1b2d3e4"
down_revision: Union[str, None] = "7ec4f4be0e8a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "pages",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("page_key", sa.String(length=100), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("subtitle", sa.Text(), nullable=True),
        sa.Column("slug", sa.String(length=255), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_pages_page_key"), "pages", ["page_key"], unique=True)

    op.create_table(
        "page_sections",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("page_key", sa.String(length=100), nullable=False),
        sa.Column("section_key", sa.String(length=100), nullable=False),
        sa.Column("section_type", sa.String(length=50), nullable=False, server_default="text"),
        sa.Column("title", sa.String(length=255), nullable=True),
        sa.Column("subtitle", sa.Text(), nullable=True),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("items", sa.JSON(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("page_key", "section_key", name="uq_page_sections_page_key_section_key"),
    )
    op.create_index(op.f("ix_page_sections_page_key"), "page_sections", ["page_key"], unique=False)

    op.add_column("articles", sa.Column("authors", sa.String(length=500), nullable=True))
    op.add_column("articles", sa.Column("cover_image", sa.String(length=500), nullable=True))
    op.add_column("articles", sa.Column("pdf_link", sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column("articles", "pdf_link")
    op.drop_column("articles", "cover_image")
    op.drop_column("articles", "authors")
    op.drop_index(op.f("ix_page_sections_page_key"), table_name="page_sections")
    op.drop_table("page_sections")
    op.drop_index(op.f("ix_pages_page_key"), table_name="pages")
    op.drop_table("pages")
