# add a new folder to the tree
def new_folder(folder_name, parent_folder_id, absolute_box_id, Folder_fileModel, BoxModel, DB):
    target_box = BoxModel.query.filter_by(id=absolute_box_id).first()

    if target_box is not None:

            try:

                folder = Folder_fileModel(name=folder_name, parent_folder_id=parent_folder_id, absolute_box_id=absolute_box_id, main=False, type="Folder")
                
                DB.session.add(folder)

                DB.session.commit()
            
            except BaseException:
                return False
            
            return True

    return False


# deletes a whole folder
def delete_folder(folderFile_id, absolute_box_id, BoxModel, folder_FileModel, cloudinaryUploader, DB):
    target_box = BoxModel.query.filter_by(id=absolute_box_id).first()
    target_folder_file = folder_FileModel.query.filter_by(id=folderFile_id).first()

    if target_box is not None and target_folder_file is not None:
        if target_folder_file.type == "Folder":
            to_delete_files = []
            to_delete_folders = []
            children = target_folder_file.children_folders

            # reccursively loop thru all files and folders and add them to their corresponding lists
            def rec_delete(children, to_delete_files, to_delete_folders):
                if len(children) > 0:
                    for i in children:
                        if i.type == "Folder":
                            to_delete_folders.append(i)

                            # if type is folder, we will run the functiona again on its children after appending it to to_delete_folders
                            rec_delete(i.children_folders, to_delete_files, to_delete_folders)
                            
                        else:
                            to_delete_files.append(i)
            
            rec_delete(children, to_delete_files, to_delete_folders)

            # delete files first
            for i in to_delete_files:
                DB.session.delete(i)
                cloudinaryUploader.destroy(i.public_id)

            # delete folders
            for i in to_delete_folders:
                DB.session.delete(i)
            
            # delete the selected folder
            DB.session.delete(target_folder_file)

            DB.session.commit()

            return True

        return False
        
    return False