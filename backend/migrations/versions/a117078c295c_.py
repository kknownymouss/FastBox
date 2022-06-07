"""empty message

Revision ID: a117078c295c
Revises: c536b7fa30ae
Create Date: 2022-04-14 23:24:42.539742

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a117078c295c'
down_revision = 'c536b7fa30ae'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('box', sa.Column('two_factor_auth', sa.Boolean(), nullable=True))
    op.add_column('box', sa.Column('two_factor_code', sa.String(length=6), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('box', 'two_factor_code')
    op.drop_column('box', 'two_factor_auth')
    # ### end Alembic commands ###
