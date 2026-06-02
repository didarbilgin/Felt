"""add detail_description and program/blog links

Revision ID: e5f6a7b8c9d0
Revises: d4e5f6a7b8c9
Create Date: 2026-05-20

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "e5f6a7b8c9d0"
down_revision: Union[str, None] = "d4e5f6a7b8c9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("programs", sa.Column("detail_description", sa.Text(), nullable=True))
    op.add_column("programs", sa.Column("link", sa.String(length=500), nullable=True))
    op.add_column("events", sa.Column("detail_description", sa.Text(), nullable=True))
    op.add_column("articles", sa.Column("detail_description", sa.Text(), nullable=True))
    op.add_column("blog_posts", sa.Column("detail_description", sa.Text(), nullable=True))
    op.add_column("blog_posts", sa.Column("link", sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column("blog_posts", "link")
    op.drop_column("blog_posts", "detail_description")
    op.drop_column("articles", "detail_description")
    op.drop_column("events", "detail_description")
    op.drop_column("programs", "link")
    op.drop_column("programs", "detail_description")
