from flask import Blueprint


authorization_bp = Blueprint("authorization", __name__)

from app.authorization import routes