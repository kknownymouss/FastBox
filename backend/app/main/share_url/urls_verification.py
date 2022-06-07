def verify_share_url(share_url, ShareModel, ShareQRcodeModel):
    target_share_url = ShareModel.query.filter_by(url=share_url).first()
    target_share_url_qrcode = ShareQRcodeModel.query.filter_by(url=share_url).first()

    # check if share url exists
    if target_share_url is not None or target_share_url_qrcode is not None:
        target_box = target_share_url.box if target_share_url else target_share_url_qrcode.box
        return (True, target_box)
    return (False, "")