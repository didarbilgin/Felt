"""create page_views table

Revision ID: f6a7b8c9d0e1
Revises: e5f6a7b8c9d0
Create Date: 2026-05-20 18:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "f6a7b8c9d0e1"
down_revision: Union[str, None] = "e5f6a7b8c9d0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "page_views",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("path", sa.String(length=500), nullable=False),
        sa.Column(
            "visited_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_page_views_path"), "page_views", ["path"], unique=False)
    op.create_index(op.f("ix_page_views_visited_at"), "page_views", ["visited_at"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_page_views_visited_at"), table_name="page_views")
    op.drop_index(op.f("ix_page_views_path"), table_name="page_views")
    op.drop_table("page_views")
