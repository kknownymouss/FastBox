def assign_share_url(box_code, share_url, BoxModel, ShareModel, DB):
    
    target_box = BoxModel.query.filter_by(code=box_code).first()

    # check if box exists
    if target_box is not None:

        share_url = ShareModel(url=share_url, box_id=target_box.id)

        DB.session.add(share_url)

        DB.session.commit()

def assign_share_url_qrcode(box_code, share_url, BoxModel, ShareQRcodeModel, DB):
    
    target_box = BoxModel.query.filter_by(code=box_code).first()

    # check if box exists
    if target_box is not None:

        share_url = ShareQRcodeModel(url=share_url, box_id=target_box.id)

        DB.session.add(share_url)

        DB.session.commit()



def destroy_share_url_qrcode(box_code, BoxModel, DB):
    target_box = BoxModel.query.filter_by(code=box_code).first()

    if target_box is not None:

        try:
            for i in target_box.share_url_qrcode:
                DB.session.delete(i)
            
            DB.session.commit()
        
        except BaseException:
            return False

        return True
    
    return False



# Delete all share URLs for a certain box
def destroy_share_urls(box_code, BoxModel, DB):
    target_box = BoxModel.query.filter_by(code=box_code).first()

    if target_box is not None:

        try:
            for i in target_box.share_urls:
                DB.session.delete(i)
            
            DB.session.commit()
        
        except BaseException:
            return False

        return True
    
    return False