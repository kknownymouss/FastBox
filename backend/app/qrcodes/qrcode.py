import segno
import os


def create_qrcode(share_url: str, filename: str):
    qrcode = segno.make_qr(share_url)
    qrcode.save(f"{filename}.png", scale=10)
    return True


def remove_qrcode(filename: str):
    if os.path.exists(f"{filename}.png"):
        os.remove(f"{filename}.png")
        return True
    else:
        return False


def assign_qrcode(qrcode_url, qrcode_public_id, box_code, BoxModel, DB):

    target_box = BoxModel.query.filter_by(code=box_code).first()

    # check if target box exists
    if target_box is not None:

        target_box.qrcode = qrcode_url
        target_box.qrcode_public_id = qrcode_public_id # used to delete the qrcode later on

        DB.session.add(target_box)
        
        DB.session.commit()

        return True
    
    return False













