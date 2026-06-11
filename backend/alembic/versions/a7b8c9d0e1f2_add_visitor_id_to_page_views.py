"""add visitor_id to page_views

Revision ID: a7b8c9d0e1f2
Revises: f6a7b8c9d0e1
Create Date: 2026-05-20 19:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "a7b8c9d0e1f2"
down_revision: Union[str, None] = "f6a7b8c9d0e1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("page_views", sa.Column("visitor_id", sa.UUID(), nullable=True))
    op.create_index(op.f("ix_page_views_visitor_id"), "page_views", ["visitor_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_page_views_visitor_id"), table_name="page_views")
    op.drop_column("page_views", "visitor_id")
