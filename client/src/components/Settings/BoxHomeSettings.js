import {useState} from "react"
import "../../static/css/BoxHomeSettings.css"
import {API_URL, getAccessToken, getActivityToken} from "../HelperMethods/Auth"
import { useHistory } from "react-router-dom"
import { copyToClipboard } from "../HelperMethods/FileActions"

function BoxHomeSettings(props) {

    const history = useHistory()

    // random generated share URL
    const [generatedURL, setGeneratedURL] = useState("")

    // input states
    const [restrictionCheckbox, setRestrictionCheckbox] = useState(props.restrict_access)
    const [twoFactorCheckbox, setTwoFactorCheckbox] = useState(props.two_factor_auth)
    const [passwordSave, setPasswordSave] = useState("")
    const [twoFactorEmail, setTwoFactorEmail] = useState(props.two_factor_email)

    // error states
    const [saveError, setSaveError] = useState(false)

    // success states
    const [saveSuccess, setSaveSuccess] = useState(false)
    
    // request a random share url from backend
    function fetchGenerateShareURL() {
        fetch(`${API_URL}/generate_share_url`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                access_token: getAccessToken(),
                activity_token: getActivityToken(),
                box_code: props.boxCode
            })
            }).then(response => response.json()).then(res => {
                if (res.access) {
                    setGeneratedURL(res.share_url)
                }
            })
    }

    // send a request to the backend in order to save the new chosen settings
    function fetchUpdateSettings() {
        fetch(`${API_URL}/save_settings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                access_token: getAccessToken(),
                activity_token: getActivityToken(),
                restrict_access: restrictionCheckbox,
                two_factor_auth: twoFactorCheckbox,
                two_factor_email: twoFactorEmail,
                box_code: props.boxCode,
                password_save: passwordSave
            })
            }).then(response => response.json()).then(res => {
                if (res.access) {
                    setPasswordSave("")
                    setSaveError(false)
                    setSaveSuccess(true)
                } else {
                    setPasswordSave("")
                    setSaveError(true)
                    setSaveSuccess(false)
                }
            })
    }

    // deletes all generated share URLs for a certain box
    function fetchDestroyURLs() {
        fetch(`${API_URL}/destroy_share_urls`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                access_token: getAccessToken(),
                activity_token: getActivityToken(),
                box_code: props.boxCode
            })
            }).then(response => response.json()).then(res => {
                if (res.access) {
                    // destroyed successfulyy
                }
            })
    }

    // deletes the whole box (lost forever)
    function fetchDeleteBox() {
        fetch(`${API_URL}/delete_box`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                access_token: getAccessToken(),
                activity_token: getActivityToken(),
                box_code: props.boxCode
            })
            }).then(response => response.json()).then(res => {
                if (res.access) {
                    history.push("/")
                }
            })
    }

    return (
        <div className="box-home-settings swing-in-top-fwd">
                    <div>
                        <h2 style={{marginBottom: "12px"}} className="lato">Share URLs</h2>
                        <h4 className="poppins bold">Use this share URL to make your box easily accessible to other people. This URL will eliminate the need of a box code and password so be careful whom you share it with.</h4>
                        <textarea placeholder="Share URL will appear here." readOnly className="lato share-url-text-area" value={generatedURL}></textarea>
                        <div style={{display: "flex", alignItems: "center", marginBottom: "2.5em"}}>
                            <button onClick={fetchGenerateShareURL} style={{backgroundColor: "var(--light-red)", color: "white", border: "none", fontSize: "16px", display: "flex", alignItems: "center"}} className="new-folder-popup-button poppins bold">
                            <span style={{userSelect: "none", marginRight: "5px"}} class="material-icons">
                                link
                            </span>
                                <p className="poppins bold box-home-settings-text">Generate share URL</p>
                            </button>
                            <button onClick={() => copyToClipboard(generatedURL)} className="copy-clipboard-button">
                                <span style={{userSelect: "none", marginRight: "5px"}} class="material-icons">
                                    content_copy
                                </span>
                                <p className="poppins bold box-home-settings-text">Copy To Clipboard</p>
                            </button>
                        </div>
                    </div>
                    <div style={{marginBottom: "2em"}}>
                        <h4 className="poppins bold"><span style={{fontFamily: "lato"}}>Destroy</span> all current active share URLs. All created and working share URLs used to access thix box will become invalid after clicking the below button.</h4>
                        <h2  style={{margin: "20px 0px"}} className="poppins bold">{props.activeShareURLs} active URLs</h2>
                        <button onClick={fetchDestroyURLs} style={{backgroundColor: "var(--light-red)", color: "white", border: "none", fontSize: "16px", display: "flex", alignItems: "center"}} className="new-folder-popup-button poppins bold">
                        <span style={{userSelect: "none", marginRight: "5px"}} class="material-icons">
                            delete
                        </span>
                            <p className="poppins bold">Destroy URLs</p>
                        </button>
                    </div>
                    <div>
                        <h2 style={{marginBottom: "12px"}} className="lato">Box</h2>
                        <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5em"}}>
                            <h4 className="poppins bold">Restrict all users who accessed the box using a <span style={{fontFamily: "lato"}}>share URL</span> from any activity except for downloading and viewing files. That means that all options will be availabe exclusively for people who access the box using a code-password combination.</h4>
                            <input checked={restrictionCheckbox} onChange={(item) => setRestrictionCheckbox(item.target.checked)} type="checkbox" style={{accentColor: "red", transform: "scale(1.2)", marginLeft: "3em", marginTop: "7px", flexShrink: "0"}}></input>
                        </div>
                    </div>
                    <div style={{marginBottom: "2em"}}>
                        <h4 className="poppins bold"><span style={{fontFamily: "lato"}}>Delete</span> this box entirely. All associated folders, files, share URLs will be deleted as well. Note that deleted boxes are unrecoverable and permanently deleted.</h4>
                        <div style={{display: "flex", alignItems: "center", margin: "20px 0px"}}>
                            <h2 className="poppins bold settings-destroy-attrs">{props.folderFileCount[0]} Folders</h2>
                            <h2  style={{margin: "0px 2em"}} className="poppins bold settings-destroy-attrs">{props.folderFileCount[1]} Files</h2>
                            <h2 className="poppins bold settings-destroy-attrs">{props.boxSize} Box Size</h2>
                        </div>
                        <button onClick={fetchDeleteBox} style={{backgroundColor: "var(--light-red)", color: "white", border: "none", fontSize: "16px", display: "flex", alignItems: "center"}} className="new-folder-popup-button poppins bold">
                        <span style={{userSelect: "none", marginRight: "5px"}} class="material-icons">
                            delete
                        </span>
                            <p className="poppins bold">Delete Box</p>
                        </button>
                    </div>
                    <div style={{marginBottom: "1.5em"}}>
                        <h2 style={{marginBottom: "12px"}} className="lato">Two-Factor Authorization</h2>
                        <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between"}}>
                            <h4 className="poppins bold">Enable extra security by adding 2FA for your personal box to ensure that no one else will access it. You will be prompted to add an email address when you switch the checkbox on which will be used for the 2FA. If this option is on , a 6 digit code will be sent to this email upon every login and it will be essential for accessing the box.</h4>
                            <input checked={twoFactorCheckbox} onChange={(item) => {
                                setTwoFactorCheckbox(item.target.checked);
                                if (!item.target.checked) {
                                    setTwoFactorEmail("")
                                }
                            }} type="checkbox" style={{accentColor: "red", transform: "scale(1.2)", marginLeft: "3em", marginTop: "7px", flexShrink: "0"}}></input>
                        </div>
                        <br></br>
                        <h4 style={{marginBottom: "1.5em"}} className="poppins bold"><span className="lato">Note:</span> If any share URL is generated and distributed , people accessing the box through this share URL will bypass the 2FA layer.</h4>
                        {twoFactorCheckbox && <div className="setting-save-div">
                            <p className="poppins bold">2FA Email: </p>
                            <input style={{width: "250px"}} value={twoFactorEmail} onChange={item => setTwoFactorEmail(item.target.value)} type="email" placeholder="Enter Email" className="password-save-input" />
                        </div>}
                    </div>
                    <div>
                        <h2 style={{marginBottom: "12px"}} className="lato">Save</h2>
                        <h4 style={{marginBottom: "1.8em"}} className="poppins bold">To apply the checkbox settings , you need to save the changes. Box password will be required.</h4>
                        <div className="setting-save-div">
                            <p className="poppins bold">Password: </p>
                            <input value={passwordSave} onChange={item => setPasswordSave(item.target.value)} type="password" placeholder="Enter Password" className="password-save-input" />
                            <button onClick={fetchUpdateSettings} style={{backgroundColor: "var(--light-red)", color: "white", border: "none", fontSize: "16px", display: "flex", alignItems: "center"}} className="new-folder-popup-button poppins bold">
                            <span style={{userSelect: "none", marginRight: "5px"}} class="material-icons">
                                save
                            </span>
                                <p className="poppins bold">Save Changes</p>
                            </button>
                        </div>
                        {saveError && <p style={{color: "var(--light-red)"}} className="poppins bold">An error has occured, please make sure you entered the right password.</p>}
                        {saveSuccess && <p style={{color: "#36944F"}} className="poppins bold">Changes saved sucessfully.</p>}
                    </div>
        </div>
    )
}


export default BoxHomeSettings