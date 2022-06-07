import {useState, useEffect} from 'react'
import {API_URL, getAccessToken, getActivityToken} from "../HelperMethods/Auth"
import FolderStructure from "./FolderStructure";
import {copyToClipboard, downloadFile, openInNewTab} from "../HelperMethods/FileActions"
import redImage from "../../static/images/red_image.svg"

function ImageIconComponent(props) {

    // UI States
    const [openMenu, setOpenMenu] = useState(false)
    const [openRename, setOpenRename] = useState(false)
    const [openMove, setOpenMove] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)

    // input states
    const [newName, setNewName] = useState(props.idMapping[props.fileId].name)

    // move menu state : the chosen folder that the folder/file will get moved to
    const [activeMoveFolder, setMoveActiveFolder] = useState(props.mainFolderId)

    // update move menu state
    const updateMoveActiveFolder = (id) => setMoveActiveFolder(id)


    // opens any of (menu, rename, move and info options) in folder menu
    const openRenameFolder = () => setOpenRename(true)
    const openMoveFolder = () => setOpenMove(true)
    const openInfoFolder = () => setOpenInfo(true)
    const handleOpenMenu = (event) => {
        props.handleOpenMenuPar(true)
        setOpenMenu(true)
        event.stopPropagation()
    }

    // moves a file to another folder
    function fetchMoveFile(event) {
        fetch(`${API_URL}/move_folder_file`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                move_to_folder_file: activeMoveFolder,
                folder_file_id: props.fileId,
                box_code: props.boxCode,
                absolute_box_id: props.idMapping[props.fileId].absolute_box,
                access_token: getAccessToken(),
                activity_token: getActivityToken(),

            })
        }).then(res => res.json()).then(res => {
            if (res.access) {
                props.updateRefetch();
                setOpenMove(false)
            }
        })
        event.stopPropagation()
    }

    // renames a file
    function saveNewName(event) {
        console.log("euyhasdba")
        fetch(`${API_URL}/rename_folder_file`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                new_name: newName,
                folder_file_id: props.fileId,
                box_code: props.boxCode,
                absolute_box_id: props.idMapping[props.fileId].absolute_box,
                access_token: getAccessToken(),
                activity_token: getActivityToken()

            })
        }).then(res => res.json()).then(res => {
            if (res.access) {
                props.updateRefetch();
                setOpenRename(false)
            }
        })
        event.stopPropagation()
    }

    // deletes a file
    function deleteFile(event) {
        fetch(`${API_URL}/delete_file`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                folder_file_id: props.fileId,
                box_code: props.boxCode,
                absolute_box_id: props.idMapping[props.fileId].absolute_box,
                access_token: getAccessToken(),
                activity_token: getActivityToken()

            })
        }).then(res => res.json()).then(res => {
            if (res.access) {
                props.updateRefetch();
                setOpenRename(false)
            }
        })
        event.stopPropagation()
    }



    // closes the menu whenever the parent main parent div gets clicked
    useEffect(() => {
        if (!props.openMenu) {
            setOpenMenu(false)
        }
    }, [props.openMenu])


    return (
        <div onClick={() => openInNewTab(openMenu, openRename, openMove, openInfo, props.idMapping[props.fileId].file_url)} className={props.gridView ? "folder-icon-wrap" : "folder-icon-wrap-inline"} style={{backgroundImage: props.imageView && props.gridView ?  `url(${props.idMapping[props.fileId].file_url})` : "", backgroundSize: "cover", backgroundPosition: "center center", color: "black"}}>
            <img style={{visibility: props.imageView && props.gridView ? "hidden" : null}} className={props.gridView ? "red-folder-svg" : "red-folder-svg-inline"} src={redImage} />
            <span style={{fontSize: "14px", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", width: "100%", backgroundColor: props.imageView && props.gridView ? "#fafafa" : "", border: props.imageView && props.gridView ? "1px solid #eee" : "", borderRadius: props.imageView && props.gridView ? "8px" : "", padding: props.imageView && props.gridView ? "3px" : ""}} className="poppins bold">{props.idMapping[props.fileId].name}</span>
            <span onClick={handleOpenMenu} style={{position: "absolute", top: "5px", right: "5px", userSelect: "none", backgroundColor: props.imageView && props.gridView ? "#fafafa" : "",  border: props.imageView && props.gridView ? "1px solid #eee" : "", borderRadius: props.imageView && props.gridView ? "8px" : ""}} className="material-icons">more_horiz</span>
            {openMenu ? <div className="folder-icon-menu swing-in-top-fwd" style={{right: props.gridView ? "" : "10px", top: props.gridView ? "" : "0px"}}>
            <div onClick={() => downloadFile(props.idMapping[props.fileId].file_url, props.idMapping[props.fileId].name)} className="folder-icon-menu-option" style={{display: "flex", alignItems: "center"}}>
                    <span style={{color: "rgb(54, 53, 53)", marginRight: "10px"}} class="material-icons">
                        download_for_offline
                    </span>
                <p className="poppins bold">Download File</p>
            </div>
            {props.fullActivityState && <div onClick={openRenameFolder} className="folder-icon-menu-option" style={{display: "flex", alignItems: "center"}}>
                <span style={{color: "rgb(54, 53, 53)", marginRight: "10px"}} class="material-icons">
                    edit
                </span>
                <p className="poppins bold">Rename</p>
            </div>}
            <div onClick={() => copyToClipboard(props.idMapping[props.fileId].file_url)} className="folder-icon-menu-option" style={{display: "flex", alignItems: "center"}}>
                <span style={{color: "rgb(54, 53, 53)", marginRight: "10px"}} class="material-icons">
                    link
                </span>
                <p className="poppins bold">Copy Link</p>
            </div>
            {props.fullActivityState && <div onClick={openMoveFolder} className="folder-icon-menu-option" style={{display: "flex", alignItems: "center"}}>
                <span style={{color: "rgb(54, 53, 53)", marginRight: "10px"}} class="material-icons">
                    drive_file_move
                </span>
                <p className="poppins bold">Move File</p>
            </div>}
            <div onClick={openInfoFolder} className="folder-icon-menu-option" style={{display: "flex", alignItems: "center"}}>
                    <span style={{color: "rgb(54, 53, 53)", marginRight: "10px"}} class="material-icons">
                        info
                    </span>
                    <p className="poppins bold">Info</p>
                </div>
            {props.fullActivityState && <div onClick={deleteFile} className="folder-icon-menu-option" style={{display: "flex", alignItems: "center"}}>
                <span style={{color: "rgb(54, 53, 53)", marginRight: "10px"}} class="material-icons">
                    delete
                </span>
                <p className="poppins bold">Delete</p>
            </div>}
            </div> : null}
            {openRename && <div onClick={event => event.stopPropagation()} className="rename-popup-div swing-in-top-fwd">
                                <div style={{display: "flex", alignItems: "stretch", marginBottom: "10px"}}>
                                    <div className="new-folder-popup-input-icon">
                                        <span className="material-icons md-24">folder</span>
                                    </div>
                                    <input autoFocus onChange={e => setNewName(e.target.value)} value={newName} onClick={event => event.stopPropagation()} className="new-folder-popup-input poppins bold" />
                                </div>
                                <div className="new-folder-popup-buttons">
                                    <button onClick={event => {
                                        setOpenRename(false);
                                        event.stopPropagation()
                                    }} className="new-folder-popup-button poppins bold">Cancel</button>
                                    <button onClick={saveNewName} style={{backgroundColor: "var(--light-red)", color: "white", border: "none"}} className="new-folder-popup-button poppins bold">Save</button>
                                </div>
                </div>}
            {openMove ? 
                <div style={{textAlign: "center"}}  onClick={event => event.stopPropagation()} className="move-popup-div swing-in-top-fwd">
                    <p className="lato" style={{fontSize: "20px", marginBottom: "5px"}}>" {props.idMapping[props.fileId].name} "</p>
                    <p style={{marginBottom: "10px"}} className="bold poppins">Where would you like to move your folder ? </p>
                    <div className="move-folder-structure-div">
                        <FolderStructure move={true} idTree={props.idTree} idMapping={props.idMapping} folderId={props.mainFolderId} activeFolder={activeMoveFolder} updateActiveFolder={updateMoveActiveFolder} setSettings={() => {}} />
                    </div>
                    <div className="new-folder-popup-buttons">
                        <button onClick={event => {
                            setOpenMove(false);
                            event.stopPropagation()
                        }} className="new-folder-popup-button poppins bold">Cancel</button>
                        <button onClick={fetchMoveFile} style={{backgroundColor: "var(--light-red)", color: "white", border: "none"}} className="new-folder-popup-button poppins bold">Move To {props.idMapping[activeMoveFolder].name}</button>
                    </div>
                </div>
                : null}
            {openInfo &&
                <div onClick={event => event.stopPropagation()} className="info-popup-div swing-in-top-fwd">
                    <div style={{display: "flex", marginBottom: "2em"}}>
                        <div style={{paddingRight: "2.5em", borderRight: "1px solid lightgray"}}>
                            <img className={"red-folder-svg"} src={redImage} />
                            <p style={{wordBreak: "break-all"}} className="poppins bold">{props.idMapping[props.fileId].name}</p>
                        </div>
                        <div style={{marginLeft: "1em", display: "flex", justifyContent: "space-between", flexDirection: "column"}}>
                            <p style={{ textAlign: "left", wordBreak: "break-all"}} className="poppins bold"><span className="lato">Name : </span>{props.idMapping[props.fileId].name}</p>
                            <p style={{ textAlign: "left", wordBreak: "break-all"}} className="poppins bold"><span className="lato">File Size : </span>{props.idMapping[props.fileId].size}</p>
                            <p style={{ textAlign: "left", wordWrap: "break-word"}} className="poppins bold"><span className="lato">Date Created : </span>{props.idMapping[props.fileId].date_created}</p>
                        </div>
                    </div>
                    <div style={{justifyContent: "center"}} className="new-folder-popup-buttons">
                        <button onClick={event => {
                            setOpenInfo(false);
                            event.stopPropagation()
                        }} className="new-folder-popup-button poppins bold">Cancel</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default ImageIconComponent