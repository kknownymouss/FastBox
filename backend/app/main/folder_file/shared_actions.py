# renames a file or folder
def rename_folder_file(folderFile_id, new_name: str, absolute_box_id, BoxModel, folder_FileModel, DB):
    target_box = BoxModel.query.filter_by(id=absolute_box_id).first()
    target_folder_file = folder_FileModel.query.filter_by(id=folderFile_id).first()
    
    if target_box is not None and target_folder_file is not None:

        try:
            target_folder_file.name = new_name

            DB.session.add(target_folder_file)

            DB.session.commit()
        
        except BaseException:
            return False

        return True

    return False


# moves a file or folder
def move_folder_file(folderFile_id, move_to_folder_file_id, absolute_box_id, BoxModel, folder_FileModel, DB):
    target_box = BoxModel.query.filter_by(id=absolute_box_id).first()
    target_folder_file = folder_FileModel.query.filter_by(id=folderFile_id).first()
    target_move_to_folder_file = folder_FileModel.query.filter_by(id=move_to_folder_file_id).first()
    
    if target_box is not None and target_folder_file is not None and target_move_to_folder_file is not None:

        try:
            target_folder_file.parent_folder_id = move_to_folder_file_id

            DB.session.add(target_folder_file)

            DB.session.commit()
        
        except BaseException:
            return False

        return True
        
    return False