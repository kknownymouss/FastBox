# add a new file to the tree
def new_file(file_name, parent_folder_id, absolute_box_id, file_url, public_id, size, Folder_fileModel, BoxModel, DB):
    target_box = BoxModel.query.filter_by(id=absolute_box_id).first()

    if target_box is not None:

            try:
                file = Folder_fileModel(name=file_name, parent_folder_id=parent_folder_id, absolute_box_id=absolute_box_id, main=False, type="File", file_url=file_url, public_id=public_id, size=size)
                
                DB.session.add(file)

                DB.session.commit()
                
            except BaseException:
                return False

            return True

    return False


# deletes a file from database
def delete_file(folderFile_id, absolute_box_id, BoxModel, folder_FileModel, cloudinaryUploader, DB):
    target_box = BoxModel.query.filter_by(id=absolute_box_id).first()
    target_folder_file = folder_FileModel.query.filter_by(id=folderFile_id).first()
    
    if target_box is not None and target_folder_file is not None:

        try:
            cloudinaryUploader.destroy(target_folder_file.public_id)

            DB.session.delete(target_folder_file)

            DB.session.commit()

            
        except BaseException:
            return False

        return True

    return False