"""drop article summary column

Revision ID: 61ee875ea891
Revises: a1b2c3d4e5f6
Create Date: 2026-05-12 11:36:47.326419

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '61ee875ea891'
down_revision: Union[str, None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade():

    op.drop_column("articles", "summary")

def downgrade():

    op.add_column(

        "articles",

        sa.Column("summary", sa.Text(), nullable=True)

    )