from app.hashing.password_hashing import verify_hash


def verify_box_connection(box_code, box_password, BoxModel):

    target_box = BoxModel.query.filter_by(code=box_code).first()

    # check if box exists
    if target_box is not None:

        if verify_hash(box_password, target_box.password):
            return True
            
        return False

    return False


