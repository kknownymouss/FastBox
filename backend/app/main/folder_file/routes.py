from flask import request, jsonify, current_app
from app.main.folder_file import main_folder_file_bp
from app.authentication.tokens import Authenticate_Tokens
from app.models import Box, ActivityToken, Folder_file, AccessToken
from app.authorization.access import verify_access
from app.main.folder_file.file_actions import delete_file, new_file
from app.main.folder_file.folder_actions import delete_folder, new_folder
from app.main.folder_file.shared_actions import rename_folder_file, move_folder_file
from app.cloudinary_store.cloudinary_helper import cloudinary_upload
from app.cloudinary_store.cloudinary_config import cloudinary
import cloudinary.uploader
from app import db

@main_folder_file_bp.route("/add_new_folder", methods=["POST"])
def add_new_folder():
    if request.method == "POST":

        request_content = request.get_json()
        request_access_token: str = request_content["access_token"]
        request_activity_token: str = request_content["activity_token"]
        request_box_code: str = request_content["box_code"]
        request_folder_name: str = request_content["folder_name"]
        request_parent_folder_id: str = request_content["parent_folder_id"]
        request_absolute_box_id: str = request_content["absolute_box_id"]

        verify_token = Authenticate_Tokens(request_box_code, request_access_token, request_activity_token, Box, ActivityToken, AccessToken, db)

        current_app.logger.info(f"Authenticating tokens in order to add new folder... [{request_box_code}]")

        if verify_token.isAuthenticated():

            current_app.logger.info(f"Authentication was successful. Now verifying activity token to verify access to the box... [{request_box_code}]")

            if verify_access(request_box_code, request_activity_token, Box, ActivityToken):

                current_app.logger.info(f"Access verified. Adding new folder now... [{request_box_code}]")

                if new_folder(request_folder_name, request_parent_folder_id, request_absolute_box_id, Folder_file, Box, db):

                    current_app.logger.info("New folder added successfully")
                    return jsonify(
                        folder_added=True
                    )

                else:
                    current_app.logger.error("New folder was not added successfully . Database error")
                    return jsonify(
                        folder_added=False
                    )

            else:
                current_app.logger.info("New folder was not added successfully due to invalid activity token (no access)")
                return jsonify(
                    folder_added=False
                )
        
        current_app.logger.info("New folder was not added successfully due to invalid access token (not authenticated)")
        return jsonify(
                    folder_added=False
                )


@main_folder_file_bp.route("/upload_files", methods=["POST"])
def upload_files() :
    if request.method == "POST":

        request_files = request.files
        request_content = request.form
        request_access_token: str = request_content["access_token"]
        request_activity_token: str = request_content["activity_token"]
        request_box_code: str = request_content["box_code"]
        request_parent_folder_id: str = request_content["parent_folder_id"]
        request_absolute_box_id: str = request_content["absolute_box_id"]

        verify_token = Authenticate_Tokens(request_box_code, request_access_token, request_activity_token, Box, ActivityToken, AccessToken, db)

        current_app.logger.info(f"Authenticating tokens in order to upload files... [{request_box_code}]")

        if verify_token.isAuthenticated():

            current_app.logger.info(f"Authentication was successful. Now verifying activity token to verify access to the box... [{request_box_code}]")

            if verify_access(request_box_code, request_activity_token, Box, ActivityToken):

                current_app.logger.info(f"Access verified. Uploading files now... [{request_box_code}]")

                for i in request_files:
                    file_name: str = request_files[i].filename

                    try:
                        upload_results = cloudinary_upload(cloudinary.uploader, request_files[i], request_absolute_box_id, Box)

                    except BaseException:
                        current_app.logger.error(f"Files could not be uploaded successfully. Cloudinary issue [{request_box_code}]")
                        return jsonify(file_added=False)

                    # public id assigned by cloudinary for the uploaded file
                    upload_public_id = upload_results['public_id']

                    if new_file(file_name, request_parent_folder_id, request_absolute_box_id, upload_results['secure_url'], upload_public_id, upload_results['bytes'], Folder_file, Box, db):
                        pass

                    else:
                        current_app.logger.error(f"Files could not be added successfully. Database Error [{request_box_code}]")
                        return jsonify(file_added=False)

                current_app.logger.info(f"Files uploaded successfully. [{request_box_code}]")
                return jsonify(file_added=True)

            current_app.logger.info(f"Files could not be uploaded successfully due to invalid activity token (no access) [{request_box_code}]")
            return jsonify(file_added=False)

        current_app.logger.info(f"Files could not be uploaded successfully due to invalid access token (not authenticated) [{request_box_code}]")
        return jsonify(file_added=False)


@main_folder_file_bp.route("/rename_folder_file", methods=["POST"])
def rename():
    if request.method == "POST":

        request_content = request.get_json()
        request_box_code: str = request_content["box_code"]
        request_access_token: str = request_content["access_token"]
        request_activity_token: str = request_content["activity_token"]
        request_folder_file_id: str = request_content["folder_file_id"]
        request_absolute_box_id: str = request_content["absolute_box_id"]
        request_new_name = request_content["new_name"]

        verify_token = Authenticate_Tokens(request_box_code, request_access_token, request_activity_token, Box, ActivityToken, AccessToken, db)

        current_app.logger.info(f"Authenticating tokens in order to rename file/folder... [{request_box_code}]")

        if verify_token.isAuthenticated():

            current_app.logger.info(f"Authentication was successful. Now verifying activity token to verify access to the box... [{request_box_code}]")

            if verify_access(request_box_code, request_activity_token, Box, ActivityToken):

                current_app.logger.info(f"Access verified. Renaming file/folder now... [{request_box_code}]")

                if rename_folder_file(request_folder_file_id, request_new_name, request_absolute_box_id, Box, Folder_file, db):
                    current_app.logger.info(f"File/Folder renamed successfully. [{request_box_code}]")
                    return jsonify(access=True)

                current_app.logger.error(f"File/Folder could not be renamed successfully. Database error [{request_box_code}]")
                return jsonify(access=False)

            current_app.logger.info(f"File/Folder could not be renamed successfully due to invalid activity token (no access) [{request_box_code}]")
            return jsonify(access=False)

        current_app.logger.info(f"File/Folder could not be renamed successfully due to invalid access token (not authenticated) [{request_box_code}]")
        return jsonify(access=False)
        

@main_folder_file_bp.route("/delete_file", methods=["POST"])
def delete():
    if request.method == "POST":

        request_content = request.get_json()
        request_box_code: str = request_content["box_code"]
        request_access_token: str = request_content["access_token"]
        request_activity_token: str = request_content["activity_token"]
        request_folder_file_id: str = request_content["folder_file_id"]
        request_absolute_box_id: str = request_content["absolute_box_id"]

        verify_token = Authenticate_Tokens(request_box_code, request_access_token, request_activity_token, Box, ActivityToken, AccessToken, db)

        current_app.logger.info(f"Authenticating tokens in order to delete file/folder... [{request_box_code}]")

        if verify_token.isAuthenticated():

            current_app.logger.info(f"Authentication was successful. Now verifying activity token to verify access to the box... [{request_box_code}]")

            if verify_access(request_box_code, request_activity_token, Box, ActivityToken):

                if Folder_file.query.filter_by(id=request_folder_file_id).first().type == "File":

                    current_app.logger.info(f"Access verified. Deleting file now... [{request_box_code}]")

                    if delete_file(request_folder_file_id, request_absolute_box_id, Box, Folder_file, cloudinary.uploader, db):
                        current_app.logger.info(f"File deleted successfully. [{request_box_code}]")
                        return jsonify(access=True)

                    else:
                        current_app.logger.error(f"File could not be deleted successfully. Database error or Cloudinary error. [{request_box_code}]")
                        return jsonify(access=False)

                else:

                    current_app.logger.info(f"Access verified. Deleting folder now... [{request_box_code}]")

                    if delete_folder(request_folder_file_id, request_absolute_box_id, Box, Folder_file, cloudinary.uploader, db):
                        current_app.logger.info(f"Folder deleted successfully. [{request_box_code}]")
                        return jsonify(access=True)

                    else:
                        current_app.logger.warn(f"Folder could not be deleted successfully. Debug delete folder function. [{request_box_code}]")
                        return jsonify(access=False)

            current_app.logger.info(f"File/Folder could not be deleted successfully due to invalid activity token (no access) [{request_box_code}]")
            return jsonify(access=False)

        current_app.logger.info(f"File/Folder could not be deleted successfully due to invalid access token (not authenticated) [{request_box_code}]")
        return jsonify(access=False)


@main_folder_file_bp.route("/move_folder_file", methods=["POST"])
def move():
    if request.method == "POST":

        request_content = request.get_json()
        request_box_code: str = request_content["box_code"]
        request_access_token: str = request_content["access_token"]
        request_activity_token: str = request_content["activity_token"]
        request_folder_file_id: str = request_content["folder_file_id"]
        request_absolute_box_id: str = request_content["absolute_box_id"]
        request_move_to_folder_file_id = request_content["move_to_folder_file"]

        verify_token = Authenticate_Tokens(request_box_code, request_access_token, request_activity_token, Box, ActivityToken, AccessToken, db)

        current_app.logger.info(f"Authenticating tokens in order to move file/folder... [{request_box_code}]")

        if verify_token.isAuthenticated():

            current_app.logger.info(f"Authentication was successful. Now verifying activity token to verify access to the box... [{request_box_code}]")

            if verify_access(request_box_code, request_activity_token, Box, ActivityToken):

                current_app.logger.info(f"Access verified. Moving file/folder now... [{request_box_code}]")

                if move_folder_file(request_folder_file_id, request_move_to_folder_file_id, request_absolute_box_id, Box, Folder_file, db):

                    current_app.logger.info(f"File/Folder moved successfully. [{request_box_code}]")

                    return jsonify(access=True)

                current_app.logger.error(f"File/Folder could not be moved successfully. Database error [{request_box_code}]")
                return jsonify(access=False)

            current_app.logger.info(f"File/Folder could not be moved successfully due to invalid activity tokens. (no access) [{request_box_code}]")
            return jsonify(access=False)

        current_app.logger.info(f"File/Folder could not be moved successfully due to invalid access tokens. (not authenticated) [{request_box_code}]")
        return jsonify(access=False)
