import { useEffect , useState , useMemo , useRef} from "react"
import React from "react"
import { useMediaQuery } from 'react-responsive'
import { responsiveHanlder } from "../HelperMethods/Responsive"
import { slideIn , slideOut , trackHier} from "../HelperMethods/DashboardActions"
import { getAccessToken , API_URL , getActivityToken } from "../HelperMethods/Auth"
import BoxHomeSettings from "../Settings/BoxHomeSettings"
import FolderIconComponent from "../SubComponents/FolderIconComponent"
import FolderStructure from "../SubComponents/FolderStructure"
import ImageIconComponent from "../SubComponents/ImageIconComponent"
import BoxLoading from "../Loadings/BoxLoading"
import BoxNotFound from "../Errors/BoxNotFound"
import logo from "../../static/images/FastBox.png"
import "../../static/css/BoxHome.css"



function BoxHome( {match}) {

    // responsive queries and consts
    const isPhone = useMediaQuery({ query: '(max-width: 428px)' })
    const isTablet = useMediaQuery({ query: '(max-width: 860px)' })
    const isDesktop = useMediaQuery({ query: '(max-width: 1440px)' })
    const views = responsiveHanlder(isPhone, isTablet, isDesktop)


    // Refs
    const f = useRef(null)
    const inputRef = useRef(null)

    // response state
    const [responseState, setResponseState] = useState({
        access: false,
        boxName: "",
        boxCode: "",
        idTree: {
        },
        idMapping: {

        },
        mainFolder : "",
        activeFolder: "",
        activeShareURLs: "",
        restrict_access: true
    })

    // input states
    const [newFolderName, setNewFolderName] = useState("")
    const [uploadedFiles, setUploadedFiles] = useState({})

    //loading states
    const [uploadLoading, setUploadLoading] = useState(false)
    const [boxLoading, setBoxLoading] = useState(true)

    // UI states
    const [newFolderPopUp, setNewFolderPopUp] = useState(false)
    const [refetchData, setRefetchData] = useState([])
    const [gridView, setGridView] = useState(true)
    const [openMenu, setOpenMenu] = useState(false)
    const [settings, setSettings] = useState(false)
    const [imageView, setImageView] = useState(false)
    const [sideMenuSmallDisplay, setSideMenuSmallDisplay] = useState(false)

    // error states
    const [newFolderNameError, setNewFolderNameError] = useState("")
    const [uploadFilesError, setUploadFilesError] = useState("")
    const [boxNotFoundError, setBoxNotFoundError] = useState(false)


    // handles opening and closing some states
    const handleOpenMenuPar = (item) => setOpenMenu(item)
    const handleChangeFiles = (event) => setUploadedFiles(event.target.files)
    const replicateInputClick = () => inputRef.current.click()
    const handleNewFolderName = (event) => setNewFolderName(event.target.value)
    const updateActiveFolder = (item) => setResponseState(prevState => ({ ...prevState , activeFolder : item }))
    const handleOpenMenu = () => {
        setOpenMenu(false)
        if ((views.phoneView || views.tabletView) && sideMenuSmallDisplay) {
            slideOut(setSideMenuSmallDisplay, f)
        }
    }

    // update the path of the current active folder (run trackHier) when response.active folder changes
    const track = useMemo(() => trackHier(responseState.idMapping, responseState.activeFolder, []), [responseState.activeFolder])


    // sends the selected files to the backend
    function sendFiles() {
        setUploadLoading(true)
        let filesToSend = new FormData()
        for (let i in uploadedFiles) {
            filesToSend.append(i, uploadedFiles[i])
        }
        filesToSend.append("access_token", getAccessToken())
        filesToSend.append("activity_token", getActivityToken())
        filesToSend.append("box_code", responseState.boxCode)
        filesToSend.append("parent_folder_id", responseState.activeFolder)
        filesToSend.append("absolute_box_id", responseState.idMapping[responseState.activeFolder].absolute_box)

        fetch(`${API_URL}/upload_files`, {
            method: "POST",
            body: filesToSend
            }).then(response => response.json()).then(res => {
                if (res.file_added) {
                    setRefetchData(prevState => prevState.concat(1))
                    setUploadedFiles({})
                    setUploadLoading(false)
                    setUploadFilesError("")
                } else {
                    setUploadLoading(false)
                    setUploadFilesError("Something went wrong. Please try again.")
                }
            })

    }


    // validate access to box with access_token
    function fetchBoxHome() {
        setBoxLoading(true)
        fetch(`${API_URL}/box/${match.params.boxCode}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                access_token: getAccessToken(),
                activity_token: getActivityToken()
            })
        }).then(res => res.json()).then(res => {
            if (res.access) {
                setBoxLoading(false)
                setBoxNotFoundError(false)
                setResponseState(prevState => ({
                    ...prevState,
                    access: true,
                    boxName: res.box_name,
                    boxCode: res.box_code,
                    folderFileCount: res.folder_file_count,
                    fullActivityState: res.verify_access,
                    settingsActivityState: res.verify_full_access,
                    boxSize: res.box_size,
                    times_accessed: res.times_accessed,
                    idMapping: res.folder_id_mapping,
                    idTree: res.id_tree,
                    mainFolder: res.main_folder,
                    activeShareURLs: res.active_share_urls,
                    restrict_access: res.restrict_access,
                    two_factor_auth: res.two_factor_auth,
                    two_factor_email: res.two_factor_email,
                    qrcodeURL: res.qrcode_url,
                    activeFolder: prevState.activeFolder ? prevState.activeFolder :  res.main_folder
                }))
            } else {
                setBoxLoading(false)
                setResponseState(prevState => ({
                    ...prevState,
                    access: false
                }))
                setBoxNotFoundError(true)
            }
        })
    }


    // cretes a new folder and saves it in the server
    function createNewFolder() {
        if (newFolderName.length > 0) {
            fetch(`${API_URL}/add_new_folder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    access_token: getAccessToken(),
                    activity_token: getActivityToken(),
                    box_code: responseState.boxCode,
                    folder_name: newFolderName,
                    parent_folder_id: responseState.activeFolder,
                    absolute_box_id: responseState.idMapping[responseState.activeFolder].absolute_box



                })
            }).then(res => res.json()).then(res => {
                if (res.folder_added) {
                    setNewFolderName("")
                    setRefetchData(prevState => prevState.concat(1))
                    setNewFolderNameError("")
                    setNewFolderPopUp(false)
                } else {
                    setNewFolderNameError("Something went wrong. Please try again.")
                }
            })
        }
        else {
            setNewFolderNameError("Please enter a name for your folder.")
        }
    }

    // refetch data from the UI everytime the refetchData dependency gets changed
    useEffect(() => {
        fetchBoxHome()
    }, [refetchData]) 

    return (
        <React.Fragment>
        {boxLoading ? <BoxLoading /> :
        boxNotFoundError ? <BoxNotFound /> :
        <div onClick={handleOpenMenu} className="box-home-wrap">
            <div  ref={f} style={{display: views.desktopView || views.ultraView ? "flex" : sideMenuSmallDisplay ? "flex" : "none"}} className="box-home-side-bar">
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexShrink: "0"}}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <img src={logo} style={{maxWidth: "35px", objectFit: "cover", marginRight: "10px"}} />
                        <h3 className="poppins bold">{responseState.boxName}</h3>
                    </div>
                    <div style={{display: "flex", alignItems: "center"}}>
                    {views.phoneView || views.tabletView ? <span onClick={e => {slideOut(setSideMenuSmallDisplay, f);e.stopPropagation()}} style={{marginRight: "10px"}} class="material-icons">
                        menu
                    </span> : null}
                        {responseState.settingsActivityState && <span onClick={(e) => {setSettings(true);if(views.phoneView || views.tabletView) {slideOut(setSideMenuSmallDisplay, f)};e.stopPropagation()}} style={{userSelect: "none"}} class="material-icons">
                            settings
                        </span>}
                    </div>
                </div>
                {(views.phoneView || views.tabletView) && <div style={{marginBottom: "10px", flexShrink: "0"}}>
                    <p style={{color: "darkgray", marginBottom: "10px"}} className="poppins bold">View</p>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div style={{display: "flex", alignItems: "center", borderRight: "2px solid darkgray", marginRight: "7px"}}>
                            <span onClick={() => setImageView(false)} style={{marginRight: "7px", borderBottom: !imageView ? "2px solid var(--light-red)" : "2px solid transparent", userSelect: "none"}} class="material-icons">
                                folder_open
                            </span>
                            <span onClick={() => setImageView(true)} style={{marginRight: "7px", borderBottom: imageView ? "2px solid var(--light-red)" : "2px solid transparent", userSelect: "none"}} class="material-icons">
                                image
                            </span>
                        </div>
                            <span onClick={() => setGridView(false)} style={{marginRight: "7px", borderBottom: !gridView ? "2px solid var(--light-red)" : "2px solid transparent", userSelect: "none"}} class="material-icons">
                                view_list
                            </span>
                            <span onClick={() => setGridView(true)} style={{borderBottom: gridView ? "2px solid var(--light-red)" : "2px solid transparent", userSelect: "none"}} class="material-icons">
                                grid_view
                            </span>
                    </div>
                    </div>}
                <div>
                    <p style={{color: "darkgray", marginBottom: "10px"}} className="poppins bold">Files</p>
                    {responseState.idMapping[responseState.mainFolder] &&
                    <FolderStructure updateActiveFolder={updateActiveFolder} activeFolder={responseState.activeFolder} idMapping={responseState.idMapping} folderId={responseState.mainFolder} idTree={responseState.idTree} setSettings={() => setSettings(false)} move={false}/>
                    }
                </div>
                <div style={{marginBottom: "10px"}}>
                    <p style={{color: "darkgray"}} className="poppins bold">
                        Box Info
                    </p>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "flex-start", marginLeft: "25px", marginTop: "15px"}}>
                        <span class="material-icons">
                            storage
                        </span>
                        <p style={{marginLeft: "10px"}} className="poppins bold">Box Size : {responseState.boxSize}</p>
                    </div>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "flex-start", marginLeft: "25px",  marginTop: "15px"}}>
                        <span class="material-icons">
                            login
                        </span>
                        <p style={{marginLeft: "10px"}} className="poppins bold">Times Accessed : {responseState.times_accessed}</p>
                    </div>
                </div>
                <div>
                    <p style={{color: "darkgray"}} className="poppins bold">
                        Box QRCODE
                    </p>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "15px"}}>
                        <img src={responseState.qrcodeURL} style={{maxWidth: "60%"}} />
                    </div>
                </div>

            </div>
            <div className="box-home-display">
                <div className="box-home-top-bar">
                    <div style={{display: "flex", alignItems: "center", justifyContent: "flex-start", userSelect: "none", flexWrap: "wrap"}}>
                    {views.phoneView || views.tabletView ? <span onClick={() => slideIn(setSideMenuSmallDisplay, f)} style={{marginRight: "10px"}} class="material-icons">
                        menu
                    </span> : null}
                    {
                        track.map((item, n, arr) => 
                        <div onClick={() => {updateActiveFolder(item);setSettings(false)}} style={{display: "flex", alignItems: "center"}}>
                            <p className="poppins bold">{responseState.idMapping[item].name}</p>
                            {n  !== arr.length - 1 && <span class="material-icons">
                            chevron_right
                            </span>}
                        </div>
                        )
                    }
                    </div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div style={{position: "relative"}}>
                            {responseState.fullActivityState && <div onClick={replicateInputClick} className="upload-folder-div" style={{display: "flex", alignItems: "center", marginRight: "20px", padding: "5px 10px", borderRadius: "8px", userSelect: "none"}}>
                                <input ref={inputRef} style={{display: "none"}} type="file" multiple={true} onChange={handleChangeFiles} />
                                <span style={{color: "var(--light-red)"}} class="material-icons">
                                add_circle
                                </span>
                                {(views.desktopView || views.tabletView || views.ultraView) && <p style={{marginLeft: "5px", whiteSpace: "nowrap"}} className="poppins bold">Upload File</p>}
                            </div>}
                            {Object.keys(uploadedFiles).length > 0 && <div className="upload-folder-popup-div swing-in-top-fwd">
                                <div style={{display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px"}}>
                                    <p style={{textAlign: "center"}} className="poppins bold">Selected Files<br></br><span style={{fontFamily: "Lato", fontSize: "25px"}}>{Object.keys(uploadedFiles).length}</span></p>
                                </div>
                                {!uploadLoading ? uploadFilesError ? 
                                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                                        <p className="poppins bold" style={{color: "var(--light-red)", textAlign: "center", marginBottom: "15px"}}>{uploadFilesError}</p> 
                                        <button onClick={() => {setUploadedFiles({});setUploadFilesError("")}} className="new-folder-popup-button poppins bold">Cancel</button>
                                    </div>
                                : <div className="new-folder-popup-buttons">
                                    <button onClick={() => setUploadedFiles({})} className="new-folder-popup-button poppins bold">Cancel</button>
                                    <button onClick={sendFiles} style={{backgroundColor: "var(--light-red)", color: "white", border: "none"}} className="new-folder-popup-button poppins bold">Upload</button>
                                </div> : 
                                <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    <div class="spinner-border" role="status">
                                        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                                    </div>
                                </div>
                            }
                            </div>}
                        </div>
                        <div style={{position: "relative"}}>
                            {responseState.fullActivityState && <div onClick={() => setNewFolderPopUp(prevState => !prevState)} className="upload-folder-div" style={{display: "flex", alignItems: "center", marginRight: "20px", padding: "5px 10px", borderRadius: "8px", userSelect: "none"}}>
                                <span style={{color: "var(--light-red)"}} class="material-icons">
                                create_new_folder
                                </span>
                                {(views.desktopView || views.tabletView || views.ultraView) && <p style={{marginLeft: "5px", whiteSpace: "nowrap"}} className="poppins bold">New Folder</p>}
                            </div>}
                            {newFolderPopUp && <div className="new-folder-popup-div swing-in-top-fwd">
                                <div style={{display: "flex", alignItems: "stretch", marginBottom: "10px"}}>
                                    <div className="new-folder-popup-input-icon">
                                        <span className="material-icons md-24">folder</span>
                                    </div>
                                    <input value={newFolderName} onChange={handleNewFolderName} placeholder="Folder Name" className="new-folder-popup-input poppins bold" />
                                </div>
                                {newFolderNameError && <p className="poppins bold" style={{color: "var(--light-red)"}}>{newFolderNameError}</p>}
                                <div className="new-folder-popup-buttons">
                                    <button onClick={() => setNewFolderPopUp(prevState => !prevState)} className="new-folder-popup-button poppins bold">Cancel</button>
                                    <button onClick={createNewFolder} style={{backgroundColor: "var(--light-red)", color: "white", border: "none"}} className="new-folder-popup-button poppins bold">Save</button>
                                </div>
                            </div>}
                        </div>
                        {(views.desktopView || views.ultraView) && <div style={{display: "flex", alignItems: "center"}}>
                            <div style={{display: "flex", alignItems: "center", borderRight: "2px solid darkgray", marginRight: "7px"}}>
                                <span onClick={() => setImageView(false)} style={{marginRight: "7px", borderBottom: !imageView ? "2px solid var(--light-red)" : "2px solid transparent", userSelect: "none"}} class="material-icons">
                                    folder_open
                                </span>
                                <span onClick={() => setImageView(true)} style={{marginRight: "7px", borderBottom: imageView ? "2px solid var(--light-red)" : "2px solid transparent", userSelect: "none"}} class="material-icons">
                                    image
                                </span>
                            </div>
                                <span onClick={() => setGridView(false)} style={{marginRight: "7px", borderBottom: !gridView ? "2px solid var(--light-red)" : "2px solid transparent", userSelect: "none"}} class="material-icons">
                                    view_list
                                </span>
                                <span onClick={() => setGridView(true)} style={{borderBottom: gridView ? "2px solid var(--light-red)" : "2px solid transparent", userSelect: "none"}} class="material-icons">
                                    grid_view
                                </span>
                        </div>}
                    </div>
                </div>
                {!settings ? 
                <div className={gridView ? "box-home-files" : "box-home-files-inline"}>
                    {responseState.idTree[responseState.mainFolder] &&
                        responseState.idTree[responseState.activeFolder].map(item => 
                            responseState.idMapping[item].type == "Folder" ? 
                            <FolderIconComponent openMenu={openMenu} handleOpenMenuPar={handleOpenMenuPar} gridView={gridView} updateActiveFolder={updateActiveFolder} idMapping={responseState.idMapping} folderId={item} boxCode={responseState.boxCode} updateRefetch={() => setRefetchData(prevState => prevState.concat(1))} idTree={responseState.idTree} mainFolderId={responseState.mainFolder} fullActivityState={responseState.fullActivityState} />
                            :
                            <ImageIconComponent openMenu={openMenu} handleOpenMenuPar={handleOpenMenuPar} gridView={gridView} idMapping={responseState.idMapping} fileId={item} boxCode={responseState.boxCode} updateRefetch={() => setRefetchData(prevState => prevState.concat(1))} imageView={imageView} idTree={responseState.idTree} mainFolderId={responseState.mainFolder} fullActivityState={responseState.fullActivityState}/>
                        )
                    }
                </div> :
                <BoxHomeSettings folderFileCount={responseState.folderFileCount} boxSize={responseState.boxSize} restrict_access={responseState.restrict_access} two_factor_auth={responseState.two_factor_auth} two_factor_email={responseState.two_factor_email} boxCode={responseState.boxCode} activeShareURLs={responseState.activeShareURLs} updateRefetch={() => setRefetchData(prevState => prevState.concat(1))} />
                }
            </div>
        </div>}
        </React.Fragment>
    )
}

export default BoxHome