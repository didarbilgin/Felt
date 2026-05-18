"""add event status column

Revision ID: b2c3d4e5f6a7
Revises: 61ee875ea891
Create Date: 2026-05-12 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b2c3d4e5f6a7"
down_revision: Union[str, None] = "61ee875ea891"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "events",
        sa.Column("status", sa.String(length=20), nullable=False, server_default="upcoming"),
    )


def downgrade() -> None:
    op.drop_column("events", "status")
