import {useState} from "react"
import ImageStructure from "./ImageStructure"
import redFolder from "../../static/images/red_folder.svg"
import "../../static/css/FolderStructure.css"
function FolderStructure(props) {

    // UI states
    const [open, setOpen] = useState(false)

    // navigate to a certain folder
    function handleOpenClick(e) {
        if (props.idMapping[props.folderId].type == "Folder") {
            setOpen(prevState => !prevState)
            props.updateActiveFolder(props.folderId)
            props.setSettings()
            e.stopPropagation()
        }
    }
    return (
        <div>
            <div onClick={handleOpenClick} style={{display: "flex", alignItems: "flex-start", justifyContent: "flex-start", userSelect: "none", marginBottom: "10px", borderRadius: "6px", padding: "3px"}} className={props.activeFolder == props.folderId ? "active-folder" : "folder-structure-div"}>
                <span style={{visibility : props.idMapping[props.folderId].type == "File" && "hidden" }} class="material-icons">
                {open ? "expand_more" : "chevron_right"}
                </span>
                <img src={redFolder} style={{maxWidth: "25px"}} />
                <p style={{marginLeft: "10px", wordBreak: "break-all"}} className="poppins bold">{props.idMapping[props.folderId].name}</p>
            </div>
            
            {open &&
                <div className="swing-in-top-fwd" style={{marginLeft: "20px"}}>
                {
                props.idTree[props.folderId].map(item => 
                props.idMapping[item].type == "Folder" ?
                <FolderStructure setSettings={() => props.setSettings()} updateActiveFolder={props.updateActiveFolder} activeFolder={props.activeFolder} idMapping={props.idMapping} idTree={props.idTree} folderId={item} move={props.move}/>
                : !props.move ?
                <ImageStructure fileId={item} idMapping={props.idMapping} />
                : 
                null
                )}
                </div>
            }   
        </div>
    )
}

export default FolderStructure
