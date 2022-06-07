# verifies that the token has the full access state regardless the box settings (meaning that the user accessed the box with code-password)
def verify_full_access(request_token, ActivityTokenModel) -> bool:

    target_token = ActivityTokenModel.query.filter_by(token=request_token).first()

    return (target_token.full_access)


# returns True if the user is allowed to view certain parts of the UI and make certain requests based on *BOTH* BOX RESTRICT ACCESS SETTINGS AND ACTIVITY TOKEN FULL ACCESS
# if the box settings doesnt restrict access, it will return True regardless the activity token full access
# else it will depend on the full access of the activity token
def verify_access(box_code, request_token, BoxModel, ActivityTokenModel) -> bool:
    target_box = BoxModel.query.filter_by(code=box_code).first()
    target_token = ActivityTokenModel.query.filter_by(token=request_token).first()

    if target_box is not None:
        if target_box.restrict_access:
            if target_token.full_access:
                return True
            else:
                return False
        else:
            return True