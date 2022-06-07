from mailing import Mailing


class TwoFactorAuth:

    """Two factor auth class, this will be initialized at in the authorization route,
    whenever checking for 2fa or verifying 2fa is need. two routes will use this class"""

    def __init__(self, box_code, two_factor_code, BoxModel, DB):
        self.box_code = box_code
        self.two_factor_code = two_factor_code
        self.BoxModel = BoxModel
        self.DB = DB

    # check for 2fa
    def check_2fa_auth(self):

        target_box = self.BoxModel.query.filter_by(code=self.box_code).first()

        # check if box exists
        if target_box is not None:

            if target_box.two_factor_auth:

                return True
                
                
            return False

        return False




    # sends the 2fa code and store it in the databse
    def send_2fa_code(self):

        target_box = self.BoxModel.query.filter_by(code=self.box_code).first()

        # check if box exists
        if target_box is not None:

          

            # assigns the 2fa code
            self.__assign_two_factor_code()

            Mailing.send_mail({
                    "recipient": target_box.two_factor_email,
                    "subject" : f"Login attempt to box {self.box_code}.",
                    "html" : f"<h3>Two factor authorization for this box is enabled. To access this box, please use this 2fa code:</h3>\n<h1>{self.two_factor_code}</h1>\nIf you haven't tried logging in, please ignore this email."
                })
            
            return True

            
        
        return False

            
    # assigns the 2fa code to the box
    def __assign_two_factor_code(self):
        
        target_box = self.BoxModel.query.filter_by(code=self.box_code).first()

        # check if box exists
        if target_box is not None:

            target_box.two_factor_code = self.two_factor_code

            self.DB.session.add(target_box)

            self.DB.session.commit()

    
    def verify_2fa_code(self):

        target_box = self.BoxModel.query.filter_by(code=self.box_code).first()

        # check if box exists
        if target_box is not None:

            if target_box.two_factor_code == self.two_factor_code:
                return True
            
            else:
                return False
        
        return False



