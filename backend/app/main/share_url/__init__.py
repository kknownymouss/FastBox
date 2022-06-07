from flask import Blueprint


main_sharing_bp = Blueprint("main_sharing", __name__)

from app.main.share_url import routes