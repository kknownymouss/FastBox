from datetime import datetime, timedelta

class Assign_Tokens:

    """ This will class be initialized whenever we need to issue new tokens upon
        logging into a box or upon creating a new box """

    def __init__(self, box_code=None, access_token=None, activity_token=None, full_access=None, BoxModel=None, AccessTokenModel=None, ActivityTokenModel=None, DB=None):
        self.box_code = box_code
        self.access_token = access_token
        self.activity_token = activity_token
        self.full_access = full_access
        self.BoxModel = BoxModel
        self.AccessTokenModel = AccessTokenModel
        self.ActivityTokenModel = ActivityTokenModel
        self.DB = DB
        self.__target_box = self.__derive_target_box()
    
    def __derive_target_box(self):
        return self.BoxModel.query.filter_by(code=self.box_code).first()


    def accessToken(self):

        # check if box exists
        if self.__target_box is not None:

            access_token = self.AccessTokenModel(token=self.access_token, box_id=self.__target_box.id, expiry=(datetime.utcnow() + timedelta(hours=1)))

            self.DB.session.add(access_token)

            self.DB.session.commit()

    def activityToken(self):

        # check if box exists
        if self.__target_box is not None:

            activity_token = self.ActivityTokenModel(token=self.activity_token, full_access=self.full_access, box_id=self.__target_box.id, expiry=(datetime.utcnow() + timedelta(hours=1)))

            self.DB.session.add(activity_token)

            self.DB.session.commit()

class Authenticate_Tokens:
    
    """ Token authentication happens in every request, to make
        the process more readable and cleaner, this class will be initialized
        at the start of every request """

    def __init__(self, box_code, access_token, activity_token, BoxModel, ActivityTokenModel, AccessTokenModel, DB) -> None:
        self.box_code = box_code
        self.access_token = access_token
        self.activity_token = activity_token
        self.BoxModel = BoxModel
        self.AccessTokenModel = AccessTokenModel
        self.ActivityTokenModel = ActivityTokenModel
        self.DB = DB
        self.__target_box = self.__derive_target_box()
        self.__access_token_obj = self.__derive_access_token_obj()
        self.__activity_token_obj = self.__derive_activity_token_obj()
    
    # functions meant for inside use only
    def __derive_target_box(self):
        return self.BoxModel.query.filter_by(code=self.box_code).first()
    
    def __derive_access_token_obj(self):
        return self.AccessTokenModel.query.filter_by(token=self.access_token).first()
        
    def __derive_activity_token_obj(self):
        return self.ActivityTokenModel.query.filter_by(token=self.activity_token).first()


    # functions meant for inside use only
    def __verify_accessToken(self) -> bool:

        # check if box exists
        if self.__target_box is not None:

            # put all valid tokens for the box in a list
            db_box_tokens = [i.token for i in self.__target_box.access_tokens]
            
            return (self.access_token in db_box_tokens)
        return False

    def __verify_activityToken(self) -> bool:

        # check if box exists
        if self.__target_box is not None:

            # put all valid tokens for the box in a list
            db_box_tokens = [i.token for i in self.__target_box.activity_tokens]
            
            return (self.activity_token in db_box_tokens)
        return False

    
    def __verify_tokens_expiry(self) -> bool:

        # check if box exists
        if self.__target_box is not None and self.__access_token_obj is not None and self.__activity_token_obj is not None:

            if (self.__access_token_obj.expiry > datetime.utcnow()) and (self.__activity_token_obj.expiry > datetime.utcnow()):
                return True

            else:

                self.DB.session.delete(self.__access_token_obj)
                self.DB.session.delete(self.__activity_token_obj)
                self.DB.session.commit()

                return False

        else:
            return False

                
    # returns true if user is authenticated (not expired, and bot activity and access are valid)
    def isAuthenticated(self) -> bool:
        return (self.__verify_tokens_expiry() and self.__verify_activityToken() and self.__verify_accessToken())
