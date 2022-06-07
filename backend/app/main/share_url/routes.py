import os 
from dotenv import load_dotenv
from flask import request, jsonify, current_app
from app import db
from app.randomization.randomization import Randomization
from app.models import Box, AccessToken, ActivityToken, Share, Share_qrcode
from app.main.share_url.urls_verification import verify_share_url
from app.authentication.tokens import Assign_Tokens
from app.authentication.tokens import Authenticate_Tokens
from app.authorization.access import verify_full_access
from app.main.share_url.urls_actions import assign_share_url, destroy_share_urls
from app.main.share_url import main_sharing_bp


# load env variables
load_dotenv()


# domain of the web app
DOMAIN = os.getenv("DOMAIN", default="")


# checks if the requested URL is found in the database and returns access/activity tokens
# corresponding to the box it belongs to
@main_sharing_bp.route("/validate_share_url", methods=["POST"])
def access_share_url():
    if request.method == "POST":

        request_content = request.get_json()
        request_share_url = f"https://{DOMAIN}/share/url/{request_content['shareUrl']}"

        current_app.logger.info("Verifying share URL...")

        if verify_share_url(request_share_url, Share, Share_qrcode)[0]:

            current_app.logger.info("Share URL verified successfully. Assigning tokens now...")

            box_code: str = verify_share_url(request_share_url, Share, Share_qrcode)[1].code
            access_token: str = Randomization.access_token()
            activity_token: str = Randomization.activity_token()
            
            # Add both tokens to the database
            try:
                assign_token: Assign_Tokens = Assign_Tokens(box_code, access_token, activity_token, False, Box, AccessToken, ActivityToken, db)
                assign_token.accessToken()
                assign_token.activityToken()

                current_app.logger.info(f"Tokens assigned successfully. [{box_code}]")
                return jsonify(
                    access_token=access_token,
                    activity_token=activity_token,
                    activity_state="view_access",
                    box_code=box_code
                )

            except BaseException:  

                current_app.logger.error(f"Tokens could not be assigned successfully. Database error. [{box_code}]")
                return jsonify(
                    access=False,
                    access_token="",
                    activity_token="",
                    box_code=""
                )

        current_app.logger.info("Share was not verified. (Does not exist)")
        return jsonify(
            access=False,
            access_token="",
            activity_token="",
            box_code=""
        )

@main_sharing_bp.route("/generate_share_url", methods=["GET", "POST"])
def generate_share_url():
    if request.method == "POST":

        request_content = request.get_json()
        request_box_code = request_content["box_code"]
        request_access_token: str = request_content["access_token"]
        request_activity_token: str = request_content["activity_token"]

        verify_token = Authenticate_Tokens(request_box_code, request_access_token, request_activity_token, Box, ActivityToken, AccessToken, db)

        current_app.logger.info(f"Authenticating tokens in order to generate share URL... [{request_box_code}]")

        if verify_token.isAuthenticated():

            current_app.logger.info(f"Authentication was successful. Now verifying activity token to verify full access to the box... [{request_box_code}]")

            if verify_full_access(request_activity_token, ActivityToken):

                current_app.logger.info(f"Full access verified. Generating share URL now... [{request_box_code}]")

                share_url = Randomization.share_url()

                try:
                    assign_share_url(request_box_code, share_url, Box, Share, db)

                    current_app.logger.info(f"Share URL generated successfully [{request_box_code}]")
                    return jsonify(
                        access=True,
                        share_url=share_url
                    )
                
                except BaseException:

                    current_app.logger.error(f"Share URL could not be generated successfully. Database error. [{request_box_code}]")
                    return jsonify(
                        access=False
                    )

            else:
                current_app.logger.info(f"Share URL could not be generated successfully due to invalid activity token. (no full access) [{request_box_code}]")
                return jsonify(
                    access=False
                )

        current_app.logger.info(f"Share URL could not be generated successfully due to invalid access token. (not authorized) [{request_box_code}]")
        return jsonify(
            access=False
        )


@main_sharing_bp.route("/destroy_share_urls", methods=["POST"])
def destroy_urls():
    if request.method == "POST":

        request_content = request.get_json()
        request_box_code: str = request_content["box_code"]
        request_access_token: str = request_content["access_token"]
        request_activity_token: str = request_content["activity_token"]

        verify_token = Authenticate_Tokens(request_box_code, request_access_token, request_activity_token, Box, ActivityToken, AccessToken, db)

        current_app.logger.info(f"Authenticating tokens in order to destroy share URLs... [{request_box_code}]")

        if verify_token.isAuthenticated():

            current_app.logger.info(f"Authentication was successful. Now verifying activity token to verify full access to the box... [{request_box_code}]")

            if verify_full_access(request_activity_token, ActivityToken):

                current_app.logger.info(f"Full access verified. Destroying share URLs now... [{request_box_code}]")

                if destroy_share_urls(request_box_code, Box, db):

                    current_app.logger.info(f"Share URLs destroyed successfully [{request_box_code}]")
                    return jsonify(access=True)
                
                else:
                    current_app.logger.error(f"Share URLs could not be destroyed successfully. Database error [{request_box_code}]")
                    return jsonify(
                        access=False
                    )
               
            else :
                current_app.logger.info(f"Share URLs could not be destroyed successfully due to invalid activity token. (no full access) [{request_box_code}]")
                return jsonify(
                    access=False
                )

        else :
            current_app.logger.info(f"Share URLs could not be destroyed successfully due to invalid access token (not authenticated) [{request_box_code}]")
            return jsonify(
                access=False
            )
