import {useHistory} from "react-router-dom"
import {useState} from "react"
import { API_URL, setAccessToken, setActivityToken } from "../HelperMethods/Auth"

function ContentBox() {

    // controls history and urls
    const history = useHistory()

    // Response state
    const [responseState, setResponseState] = useState({
        boxCode: "",
    })

    // UI states
    const [contentState, setContentState] = useState("Generate")
    const [passwordGenerate, setPasswordGenerate] = useState(false)
    const [generateDone, setGenerateDone] = useState(false)
    const [passwordConnect, setPasswordConnect] = useState(false)
    const [twoFactor, setTwoFactor] = useState(false)

     // Input states
     const [boxName, setBoxName] = useState("")
     const [boxCode, setBoxCode] = useState("")
     const [boxPassword, setBoxPassword] = useState("")
     const [boxPasswordConnect, setBoxPasswordConnect] = useState("")
     const [twoFactorCode, setTwoFactorCode] = useState("")
 
     // Error messages state
     const [boxNameError, setBoxNameError] = useState("")
     const [boxCodeError, setBoxCodeError] = useState("")
     const [invalidPasswordConnectError, setInvalidPasswordConnectError] = useState("")
     const [boxPasswordError, setBoxPasswordError] = useState("")
     const [invalid2FACode, setInvalid2FACode] = useState("")
 
     // Loading states
     const [loadingBoxCode, setLoadingBoxCode] = useState(false)
     const [loadingBoxName, setLoadingBoxName] = useState(false)
     const [loadingBox2FA, setLoadingBox2FA] = useState(false)

     // fetches a random box code from the backend API
    function fetchRandomBoxCode(boxName, boxPassword) {
        fetch(`${API_URL}/get_random_box_code`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                boxName: boxName,
                boxPassword: boxPassword
            })
        }).then(res => res.json()).then(res => {
            setGenerateDone(true)
            setLoadingBoxName(false)
            setResponseState(prevState => ({...prevState, boxCode: res.box_code}))
            setAccessToken(res.access_token)
            setActivityToken(res.activity_token)
        })
    }

    // fetches password verification from backend
    function fetchPasswordVerification(boxCode, boxPassword) {
        fetch(`${API_URL}/connect_to_box`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                boxCode: boxCode,
                boxPassword: boxPassword
            })
        }).then(res => res.json()).then(res => {
            setLoadingBoxCode(false)
            setAccessToken(res.access_token)
            setActivityToken(res.activity_token)
            if (res.two_factor_auth) {
                setTwoFactor(true)
            } else {
                if (res.access_token.length > 0) {
                    redirectToBox(boxCode)
                } else {
                    setInvalidPasswordConnectError("Invalid Password")

                }
            }
        })
    }

    // fetches password verification from backend
    function fetch2FAVerification(boxCode, boxPassword) {
        fetch(`${API_URL}/connect_to_box_2fa`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                boxCode: boxCode,
                boxPassword: boxPassword,
                twoFactorCode: twoFactorCode,
            })
        }).then(res => res.json()).then(res => {
            setLoadingBox2FA(false)
            setAccessToken(res.access_token)
            setActivityToken(res.activity_token)

            if (res.access_token.length > 0) {
                redirectToBox(boxCode)
            } else {
                setInvalid2FACode("Invalid 2FA Code.")

            }
        })
    }

    // this function redirects the user to box home page after connecting
    function redirectToBox(boxCode) {
        history.push(`/${boxCode}`)
    }

    // store box name input in state
    function handleSubmitBoxName(event) {
        if (boxName.length > 5) {
            setBoxNameError("")
            setPasswordGenerate(true)
        } else {
            setBoxNameError("Make sure Box Name exceeds 5 characters.")
        }
    }

    // submits box name and box password to backend for processing (generate)
    function handleSubmitBoxPassword(event) {
        if (boxPassword) {
            setLoadingBoxName(true)
            setBoxPasswordError("")
            fetchRandomBoxCode(boxName, boxPassword)
            
        } else {
            setBoxPasswordError("Please enter a password")
        }
    }

    // submits box code and box password to ask for access (connect)
    function handleSubmitConnectAccess(event) {
        if (boxPasswordConnect) {
            setLoadingBoxCode(true)
            setInvalidPasswordConnectError("")
            fetchPasswordVerification(boxCode, boxPasswordConnect)
            
            
        } else {
            setInvalidPasswordConnectError("Please enter a password")
        }
    }

     // submits box code and box password to ask for access (connect)
     function handleSubmit2FAAccess(event) {
        if (twoFactorCode) {
            setLoadingBox2FA(true)
            setInvalid2FACode("")
            fetch2FAVerification(boxCode, boxPasswordConnect)
            
            
        } else {
            setInvalid2FACode("Please enter the 2fa code.")
        }
    }

    // changes state to allow prompt asking for password when connecting
    function handleSubmitConnectBoxCode() {
        if (boxCode) {
            setPasswordConnect(true)
            setBoxCodeError("")
        } else {
            setBoxCodeError("Invalid Box Code")
        }
    }

     return (
         <>
         {contentState === "Generate" ? passwordGenerate ? 
         <div key={0} className="content-div swing-in-top-fwd" id="content-box-id">
         <h1 className="poppins normal content-header">Create a Box</h1>
         {generateDone && (responseState.boxCode).length > 0 ? 
             <>
                 <p className="poppins bold content-name-header">Box Code generated successfully</p>
                 <p className="lato bold" style={{fontSize: "30px", marginBottom: "5px"}}>{responseState.boxCode}</p>
                 <button onClick={() => redirectToBox(responseState.boxCode)} className="content-button">Connect To Box</button>
             </>
         :
         <>
             <p className="poppins bold content-name-header">Pick a password for your Box</p>
             <input type="password" value={boxPassword} onChange={(e) => setBoxPassword(e.target.value)} placeholder="Password" className="box-name-input poppins bold"></input>
             {boxPasswordError.length > 0 && <p className="poppins bold swing-in-top-fwd" style={{color: "var(--light-red)", textAlign: "center"}}>{boxPasswordError}</p>}
             {!loadingBoxName ? <button onClick={handleSubmitBoxPassword} className="content-button">Generate</button> : <button className="content-button"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></button>}
         </>}
         </div>  :
         <div key={1} className="content-div swing-in-top-fwd" id="content-box-id">
             <h1 className="poppins normal content-header">Create a Box</h1>
             <p className="poppins bold content-name-header">Pick a name for your Box</p>
             <input value={boxName} onChange={(e) => setBoxName(e.target.value)} placeholder="Box Name" className="box-name-input poppins bold"></input>
             {boxNameError.length > 0 && <p className="poppins bold swing-in-top-fwd" style={{color: "var(--light-red)", textAlign: "center"}}>{boxNameError}</p>}
             <button onClick={handleSubmitBoxName} className="content-button">Generate</button>
             <p className="existing-box-header poppins bold">or do you know the code for an existing box ?</p>
             <button onClick={() => setContentState("Connect")} className="content-button">Connect</button>
         </div> 
         :
         
             passwordConnect ? 

             twoFactor ? 

              <div key={6} className="content-div swing-in-top-fwd" id="content-box-id">
                 <h1 className="poppins normal content-header">Connect To a Box</h1>
                 <p className="poppins bold content-name-header">Enter the code sent to your email.</p>
                 <input type="text" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} placeholder="Password" className="box-name-input poppins bold"></input>
                 {invalid2FACode.length > 0 && <p className="poppins bold swing-in-top-fwd" style={{color: "var(--light-red)", textAlign: "center"}}>{invalid2FACode}</p>}
                 {!loadingBox2FA ? <button onClick={handleSubmit2FAAccess} className="content-button">Connect</button> : <button className="content-button"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></button>}
             </div>
               :
             <div key={3} className="content-div swing-in-top-fwd" id="content-box-id">
                 <h1 className="poppins normal content-header">Connect To a Box</h1>
                 <p className="poppins bold content-name-header">Enter the Box password</p>
                 <input type="password" value={boxPasswordConnect} onChange={(e) => setBoxPasswordConnect(e.target.value)} placeholder="Password" className="box-name-input poppins bold"></input>
                 {invalidPasswordConnectError.length > 0 && <p className="poppins bold swing-in-top-fwd" style={{color: "var(--light-red)", textAlign: "center"}}>{invalidPasswordConnectError}</p>}
                 {!loadingBoxCode ? <button onClick={handleSubmitConnectAccess} className="content-button">Connect</button> : <button className="content-button"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></button>}
             </div>
              : 
              <div key={5} className="content-div swing-in-top-fwd" id="content-box-id">
                 <h1 className="poppins normal content-header">Connect To a Box</h1>
                 <p className="poppins bold content-name-header">Please enter the Box Code</p>
                 <input value={boxCode} onChange={(e) => setBoxCode(e.target.value)} placeholder="Box Code" className="box-name-input poppins bold"></input>
                 {boxCodeError.length > 0 && <p className="poppins bold swing-in-top-fwd" style={{color: "var(--light-red)", textAlign: "center"}}>{boxCodeError}</p>}
                 <button onClick={handleSubmitConnectBoxCode} className="content-button">Connect</button>
                 <p className="existing-box-header poppins bold">or do you want to create a new box ?</p>
                 <button onClick={() => setContentState("Generate")} className="content-button">Generate</button>
             </div>
         }
         </>
     )
}

export default ContentBox