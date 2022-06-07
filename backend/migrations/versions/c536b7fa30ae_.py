"""empty message

Revision ID: c536b7fa30ae
Revises: bbe4b9adad3d
Create Date: 2022-03-31 23:26:49.112256

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c536b7fa30ae'
down_revision = 'bbe4b9adad3d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('access_token', sa.Column('expiry', sa.DateTime(), nullable=True))
    op.add_column('activity_token', sa.Column('expiry', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('activity_token', 'expiry')
    op.drop_column('access_token', 'expiry')
    # ### end Alembic commands ###
