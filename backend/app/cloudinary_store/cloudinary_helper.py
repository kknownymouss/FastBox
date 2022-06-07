
# uploads a file to cloudinary
def cloudinary_upload(uploader, file, absolute_box_id, BoxModel):
    target_box = BoxModel.query.filter_by(id=absolute_box_id).first()

    if target_box is not None:

        # public id will be assigned randomly by cloudinary
        upload_result_image = uploader.upload(file, 
            resource_type = "auto",
            folder = f"{target_box.code}/", 
            overwrite = True, 
        )
        return upload_result_image
    return ""