from flask import Blueprint


main_box_bp = Blueprint("main_box", __name__)

from app.main.box import routes