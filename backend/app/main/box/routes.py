import time
from app import db
from flask import request, jsonify, current_app
from app.main.box import main_box_bp
from app.authentication.tokens import Authenticate_Tokens
from app.main.box.box_helper import Box_Helper
from app.models import Box, AccessToken, ActivityToken, Folder_file
from app.authorization.access import verify_access, verify_full_access
from app.authorization.connection import verify_box_connection
from app.cloudinary_store.cloudinary_config import cloudinary
import cloudinary.uploader
import cloudinary.api


# returns all database data needed to render the home page fo your box
@main_box_bp.route("/box/<box_code>", methods=["GET", "POST"])
def get_box_home(box_code):
    if request.method == "POST":

        request_content = request.get_json()
        request_access_token: str = request_content["access_token"]
        request_activity_token: str = request_content["activity_token"]

        verify_token = Authenticate_Tokens(box_code, request_access_token, request_activity_token, Box, ActivityToken, AccessToken, db)

        current_app.logger.info(f"Accessing box content by authenticating tokens... [{box_code}]")

        if verify_token.isAuthenticated():
            box_helper = Box_Helper(box_code, Box)
            target_box : Box = box_helper.get_target_box()

            current_app.logger.info(f"Authentication was successful and box contents are accessed. [{box_code}]")

            time.sleep(2)

            return jsonify(
                access = True,
                box_name = target_box.name,
                box_code = target_box.code,
                box_size = box_helper.box_size(),
                folder_file_count = box_helper.count_folders_files(),
                times_accessed = box_helper.number_of_visits(),
                qrcode_url= target_box.qrcode,
                id_tree = box_helper.id_hierarchy(),
                folder_id_mapping = box_helper.folder_file_id_mapping(),
                main_folder = box_helper.main_folder_id(),
                verify_access = verify_access(box_code, request_activity_token, Box, ActivityToken),
                verify_full_access = verify_full_access(request_activity_token, ActivityToken),
                restrict_access = target_box.restrict_access,
                two_factor_auth = target_box.two_factor_auth,
                two_factor_email = target_box.two_factor_email,
                active_share_urls = str(len(target_box.share_urls))
            )

        current_app.logger.info(f"Authentication was unsuccessful and box contents could not accessed. [{box_code}]")    

        time.sleep(2)

        return jsonify(access=False)
    


@main_box_bp.route("/delete_box", methods=["POST"])
def delete_box():
    if request.method == "POST":

        request_content = request.get_json()
        request_box_code: str = request_content["box_code"]
        request_access_token: str = request_content["access_token"]
        request_activity_token: str = request_content["activity_token"]

        verify_token = Authenticate_Tokens(request_box_code, request_access_token, request_activity_token, Box, ActivityToken, AccessToken, db)

        current_app.logger.info(f"Authenticating tokens in order to delete box... [{request_box_code}]")

        if verify_token.isAuthenticated():

            current_app.logger.info(f"Authentication was successful. Now verifying activity token to verify full access to the box... [{request_box_code}]")

            if verify_full_access(request_activity_token, ActivityToken):

                current_app.logger.info(f"Full access verified. Deleting box now... [{request_box_code}]")

                if Box_Helper.destroy_box(request_box_code, Folder_file, cloudinary.uploader, cloudinary.api, Box, db):
                    current_app.logger.info(f"Box deleted successfully. [{request_box_code}]")
                    return jsonify(access=True)
                
                else:
                    current_app.logger.error(f"Box could not be deleted successfully. Database error [{request_box_code}]")
                    return jsonify(access=False)
               
            else :
                current_app.logger.info(f"Box could not be deleted successfully due to invalid activity token (no access) [{request_box_code}]")
                return jsonify(
                    access=False
                )
        else :
            current_app.logger.info(f"Box could not be deleted successfully due to invalid access token (not authenticated) [{request_box_code}]")
            return jsonify(
                access=False
            )

@main_box_bp.route("/save_settings", methods=["POST"])
def save_changes():
    if request.method == "POST":

        request_content = request.get_json()
        request_box_code: str = request_content["box_code"]
        request_restriction_checkbox: bool = request_content["restrict_access"]
        request_two_factor_auth: bool = request_content["two_factor_auth"]
        request_two_factor_email: bool = request_content["two_factor_email"]
        request_password_save: str = request_content["password_save"]
        request_access_token: str = request_content["access_token"]
        request_activity_token: str = request_content["activity_token"]

        verify_token = Authenticate_Tokens(request_box_code, request_access_token, request_activity_token, Box, ActivityToken, AccessToken, db)

        current_app.logger.info(f"Authenticating tokens in order to save box settings... [{request_box_code}]")

        if verify_token.isAuthenticated():

            current_app.logger.info(f"Authentication was successful. Now verifying activity token to verify full access to the box... [{request_box_code}]")

            if verify_full_access(request_activity_token, ActivityToken):

                current_app.logger.info(f"Full access verified. Verifying box password now... [{request_box_code}]")

                if verify_box_connection(request_box_code, request_password_save, Box):

                    current_app.logger.info(f"Box password verified, saving box settings now... [{request_box_code}]")

                    if Box_Helper.updateBoxSettings(request_restriction_checkbox, request_two_factor_auth, request_two_factor_email, request_box_code, Box, db):

                        current_app.logger.info(f"Settings saved successfully. [{request_box_code}]")

                        return jsonify(
                            access=True
                        )
                    
                    else:
                        current_app.logger.error(f"Settings could not be saved successfully. Database error [{request_box_code}]")
                        return jsonify(access=False)

                else:
                    current_app.logger.info(f"Settings could not be saved successfully due to wrong password. (failed to confirm) [{request_box_code}]")
                    return jsonify(
                        access=False
                    )

            else :
                current_app.logger.info(f"Settings could not be saved successfully due to invalid activity token. (no full access) [{request_box_code}]")
                return jsonify(
                    access=False
                )

        else :
            current_app.logger.info(f"Settings could not be saved successfully due to invalid access token. (not authenticated) [{request_box_code}]")
            return jsonify(
                access=False
            )