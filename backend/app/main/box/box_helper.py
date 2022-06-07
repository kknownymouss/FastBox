from app.main.folder_file.file_actions import delete_file
from app.main.folder_file.folder_actions import delete_folder

class Box_Helper:

    """ Prevents repetetive passing of arguments to functions and includes
        most of the box computational functions aside from authorization
        and authentication. Also includes some static methods that inflict
        changes in the database. Static methods were
        added in this class and not as separate functions since 
        1- they are box related functions.
        2- makes code more readable """

    def __init__(self, box_code, BoxModel):
        self.box_code = box_code
        self.BoxModel = BoxModel
        self.__target_box = self.__derive_target_box()
    
    def __derive_target_box(self):
        return self.BoxModel.query.filter_by(code=self.box_code).first()
    
    def get_target_box(self):
        return self.__target_box
        
    def number_of_visits(self) -> str:
        if self.__target_box is not None:
            return str(len(self.__target_box.access_tokens))
        else:
            return 0
    
    
    def box_size(self) -> str:

        box_size: int = 0 # in bytes

        if self.__target_box is not None:
            target_files = list(filter(lambda x: x.type=="File", self.__target_box.absolute_children))

            if len(target_files) > 0:
                for i in target_files:

                    box_size += i.size if i.size is not None else 0

                if box_size // 1073741824 >= 1:
                    return f"{box_size // 1073741824} GB"
                elif box_size // 1048576 >= 1:
                    return f"{box_size // 1048576} MB"
                elif box_size // 1024 >= 1:
                    return f"{box_size // 1024} KB"
                else:
                    return f"{box_size} B"
                
            return "0 B"
        else:
            return "0 B"
    
    def main_folder_id(self) -> str:

        # check if box exists
        if self.__target_box is not None:
                target_folders = self.__target_box.absolute_children
                target = list(filter(lambda x: x.main, target_folders))
                return str(target[0].id)
        return ""
    
        # returns the ID hierarchy of the box, containing all files and folders IDs
    def id_hierarchy(self) -> dict:

        # check if box exists
        if self.__target_box is not None:
            target_folders = list(filter(lambda x: x.type=="Folder", self.__target_box.absolute_children))
            id_tree = {str(i.id): [j.id for j in i.children_folders] for i in target_folders}
            return id_tree
        
        return {}
    
    # returns a dict containing info about every folder/file ID
    def folder_file_id_mapping(self) -> dict:

        # check if box exists
        if self.__target_box is not None:
            target_folders = self.__target_box.absolute_children
            id_mapping = {str(i.id) : {
                "name": i.name,
                "type": i.type,
                "size": self.convert_size(i.size) if i.size else "0 B",
                "date_created": i.date_created.strftime("%c") if i.date_created else "Unknown" ,
                "parent_folder": str(i.parent_folder.id) if i.parent_folder else "",
                "main": i.main,
                "absolute_box": i.absolute_box_id,
                "file_url": str(i.file_url) if i.file_url else ""
            } for i in target_folders}
            return id_mapping
        return {}
    
    
    def count_folders_files(self) -> tuple[str, str]:

        # check if target box exists
        if self.__target_box is not None:
            target_files = list(filter(lambda x: x.type=="File", self.__target_box.absolute_children))

            target_folders = list(filter(lambda x: x.type=="Folder", self.__target_box.absolute_children))

            return (str(len(target_folders)), str(len(target_files)))

        return ("", "")


    @staticmethod
    def convert_size(bytes_size):
        if bytes_size // 1073741824 >= 1:
            return f"{bytes_size // 1073741824} GB"
        elif bytes_size // 1048576 >= 1:
            return f"{bytes_size // 1048576} MB"
        elif bytes_size // 1024 >= 1:
            return f"{bytes_size // 1024} KB"
        else:
            return f"{bytes_size} B"
    
    # updates the box settings (currently only restrict access is available)
    @staticmethod
    def updateBoxSettings(restrict_access, two_factor_auth, two_factor_email, box_code, BoxModel, DB):
        target_box = BoxModel.query.filter_by(code=box_code).first()

        if target_box is not None:

            try:
                target_box.restrict_access = restrict_access
                target_box.two_factor_auth = two_factor_auth
                target_box.two_factor_email = two_factor_email
                
                DB.session.add(target_box)

                DB.session.commit()
            
            except BaseException:
                return False

            return True
        
        else:
            return False
    
    # destroys a whole box and its files and folders
    @staticmethod
    def destroy_box(box_code, FolderFileModel, cloudinaryUploader, cloudinaryAPI, BoxModel, DB):
        target_box = BoxModel.query.filter_by(code=box_code).first()

        if target_box is not None:
            
            try:
                target_folder_files = target_box.absolute_children

                target_activity_tokens = target_box.activity_tokens

                target_access_tokens = target_box.access_tokens 
            
                target_access_tokens = target_box.access_tokens 

                target_share_urls = target_box.share_urls

                target_share_url_qrcode = target_box.share_url_qrcode

                for i in target_folder_files:

                    if i.type == "File":
                        delete_file(i.id, target_box.id, BoxModel, FolderFileModel, cloudinaryUploader, DB)
                    else:
                        delete_folder(i.id, target_box.id, BoxModel, FolderFileModel, cloudinaryUploader, DB)

                
                # remove the qrcode pic
                cloudinaryUploader.destroy(target_box.qrcode_public_id)
                
                for i in target_access_tokens:
                    DB.session.delete(i)
                
                for i in target_activity_tokens:
                    DB.session.delete(i)
                
                for i in target_share_urls:
                    DB.session.delete(i)
                
                for i in target_share_url_qrcode:
                    DB.session.delete(i)

                DB.session.delete(target_box)

                DB.session.commit()

                cloudinaryAPI.delete_folder(f"{target_box.name}")

            except BaseException:
                return False

            return True
            
        return False