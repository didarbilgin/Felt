"""extend article research fields

Revision ID: a1b2c3d4e5f6
Revises: 34c6cb3372f6
Create Date: 2026-05-12 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "34c6cb3372f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("articles", sa.Column("abstract", sa.Text(), nullable=True))
    op.add_column(
        "articles",
        sa.Column("article_type", sa.String(length=50), nullable=False, server_default="article"),
    )
    op.add_column(
        "articles",
        sa.Column("year", sa.Integer(), nullable=False, server_default=sa.text("2026")),
    )
    op.add_column(
        "articles",
        sa.Column("language", sa.String(length=10), nullable=False, server_default="TR"),
    )
    op.add_column("articles", sa.Column("source", sa.String(length=255), nullable=True))
    op.add_column(
        "articles",
        sa.Column("tags", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")),
    )
    op.add_column("articles", sa.Column("link", sa.String(length=500), nullable=True))
    op.add_column("articles", sa.Column("doi", sa.String(length=255), nullable=True))

    op.execute(
        sa.text("UPDATE articles SET abstract = summary WHERE abstract IS NULL AND summary IS NOT NULL")
    )


def downgrade() -> None:
    op.drop_column("articles", "doi")
    op.drop_column("articles", "link")
    op.drop_column("articles", "tags")
    op.drop_column("articles", "source")
    op.drop_column("articles", "language")
    op.drop_column("articles", "year")
    op.drop_column("articles", "article_type")
    op.drop_column("articles", "abstract")
