from flask import Blueprint


serve_bp = Blueprint("heroku_serving", __name__)

from app.heroku_serving import routes