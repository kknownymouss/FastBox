import os
import time
import threading
from app import db
import cloudinary.uploader
from dotenv import load_dotenv
from flask import request, jsonify, current_app
from app.randomization.randomization import Randomization
from app.models import Box, AccessToken, ActivityToken, Folder_file, Share_qrcode
from app.hashing.password_hashing import hash_password
from app.authorization.connection import verify_box_connection
from app.authentication.tokens import Assign_Tokens
from app.authorization import authorization_bp
from app.authorization.two_factor_auth import TwoFactorAuth
from app.qrcodes.qrcode import create_qrcode
from app.cloudinary_store.cloudinary_config import cloudinary
from app.cloudinary_store.cloudinary_helper import cloudinary_upload
from app.main.share_url.urls_actions import assign_share_url_qrcode
from app.qrcodes.qrcode import assign_qrcode, remove_qrcode


# load enviroment variables
load_dotenv()


# The domain in which the website is running on (frontend for now)
DOMAIN = os.getenv("DOMAIN", default="")



# generate a random box code, add it to the db and return the access token
@authorization_bp.route("/get_random_box_code", methods=["POST"])
def get_random_box_code():
    if request.method == "POST":

        current_app.logger.info("Generating random box code...")

        # request data
        request_content = request.get_json()

        # randomizations
        access_token: str = Randomization.access_token()
        activity_token: str = Randomization.activity_token()
        box_code: str = Randomization.box_code()

        try:
                    
            # initiate box object and flush to get auto-incremented id
            box_db = Box(code=box_code, name=request_content['boxName'], password=hash_password(request_content['boxPassword']))
            db.session.add(box_db)
            db.session.flush()

            # create and assign a share url to create the qrcode
            share_url = Randomization.share_url()
            assign_share_url_qrcode(box_code, share_url, Box, Share_qrcode, db)

            # create and assign the qrcode, upload its image to cloudinary and store the url in the db
            filename = Randomization.filename()
            create_qrcode(share_url, filename)
            upload_results = cloudinary_upload(cloudinary.uploader, f"{filename}.png", box_db.id, Box)
            upload_public_id = upload_results['public_id'] # public id assigned by cloudinary for the uploaded file
            assign_qrcode(upload_results["secure_url"], upload_public_id, box_code, Box, db)
            threading.Thread(target=remove_qrcode, args=(filename, )).start() # remove the saved qrcode image after uploading to cloudinary

            # commit box code and access/activity token to the db
            assign_token: Assign_Tokens = Assign_Tokens(box_code, access_token, activity_token, True, Box, AccessToken, ActivityToken, db)
            assign_token.accessToken()
            assign_token.activityToken()

            # create initial main folder
            main_folder = Folder_file(name=box_code, absolute_box_id=box_db.id, type="Folder", main=True)
            db.session.add(main_folder)

            db.session.commit()

            time.sleep(2)

            current_app.logger.info(f"Random box code generated successfully -> {box_code}")

            return jsonify(
                access=True,
                box_code=box_code,
                access_token=access_token,
                activity_token=activity_token,
                activity_state="full_access",
            )
        
        except BaseException:
            current_app.logger.error("Random box code could not be generated successfully. Database error.")
            return jsonify(
                access=False
            )

@authorization_bp.route("/connect_to_box", methods=["POST"])
def get_box_access():
    if request.method == "POST":
        
        request_content = request.get_json()
        request_box_password: str = request_content["boxPassword"]
        request_box_code: str = request_content["boxCode"]

        current_app.logger.info(f"Connecting to box... [{request_box_code}]")

        if verify_box_connection(request_box_code, request_box_password, Box):

            two_factor_code = Randomization.two_factor_code()

            TwoFactorAuthClass = TwoFactorAuth(request_box_code, two_factor_code, Box, db)

            if TwoFactorAuthClass.check_2fa_auth():

                current_app.logger.info(f"Two factor authentication is enabled for this box. Sending email... [{request_box_code}]")
                
                # sends the 2fa code and stores it
                if TwoFactorAuthClass.send_2fa_code():

                    current_app.logger.info(f"Email sent successfully. [{request_box_code}]")

                    return jsonify(
                        access_token="",
                        activity_token="",
                        two_factor_auth=True
                    )
                
                current_app.logger.info(f"Email could not be sent successfully. [{request_box_code}]")

                return jsonify(
                    access_token="",
                    activity_token="",
                    two_factor_auth=False
                )
            
            else:

                access_token: str = Randomization.access_token()
                activity_token = Randomization.activity_token()
                
                # Add both tokns to the database
                assign_token: Assign_Tokens = Assign_Tokens(request_box_code, access_token, activity_token, True, Box, AccessToken, ActivityToken, db)
                assign_token.accessToken()
                assign_token.activityToken()

                current_app.logger.info(f"Connection was successful and access is given. [{request_box_code}]")
                return jsonify(
                    access_token=access_token,
                    activity_token=activity_token,
                    two_factor_auth=False
                )

        current_app.logger.info(f"Connection was unsuccessful and access is denied. [{request_box_code}]")
        return jsonify(
            access_token="",
            activity_token="",
            two_factor_auth=False
        )

@authorization_bp.route("/connect_to_box_2fa", methods=["POST"])
def get_box_access_2fa():
    if request.method == "POST":
        
        request_content = request.get_json()
        request_box_password: str = request_content["boxPassword"]
        request_box_code: str = request_content["boxCode"]
        request_two_factor_code: str = request_content["twoFactorCode"]

        current_app.logger.info(f"Verifying 2fa code... [{request_box_code}]")

        TwoFactorAuthClass = TwoFactorAuth(request_box_code, request_two_factor_code, Box, db)

        if TwoFactorAuthClass.verify_2fa_code():

            access_token: str = Randomization.access_token()
            activity_token = Randomization.activity_token()
            
            # Add both tokns to the database
            assign_token: Assign_Tokens = Assign_Tokens(request_box_code, access_token, activity_token, True, Box, AccessToken, ActivityToken, db)
            assign_token.accessToken()
            assign_token.activityToken()

            current_app.logger.info(f"2fa verification was successful and access is given. [{request_box_code}]")

            return jsonify(
                access_token=access_token,
                activity_token=activity_token,
            )
        
        
    
        else:

            current_app.logger.info(f"2fa verification was not successful and access is not given. [{request_box_code}]")
            return jsonify(
                access_token="",
                activity_token="",
            )
