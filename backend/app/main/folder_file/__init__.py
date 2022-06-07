from flask import Blueprint


main_folder_file_bp = Blueprint("main_folder_file", __name__)

from app.main.folder_file import routes