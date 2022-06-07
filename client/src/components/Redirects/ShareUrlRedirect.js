import {API_URL, setAccessToken, setActivityToken} from "../HelperMethods/Auth"
import {useHistory} from "react-router-dom"
import { useEffect, useState } from "react"

function ShareUrlRedirect({ match }) {

    const history = useHistory()
    
    const [message, setMessage] = useState("Please wait a moment...")

    // fetches password verification from backend
    function fetchShareUrl() {
        fetch(`${API_URL}/validate_share_url`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                shareUrl: match.params.shareUrl
            })
        }).then(res => res.json()).then(res => {
            setAccessToken(res.access_token)
            setActivityToken(res.activity_token)
            if (res.access_token.length > 0) {
                redirectToBox(res.box_code)
            } else {
                setMessage("Invalid Url.")
            }
        })
    }

     // this function redirects the user to box home page after connecting
     function redirectToBox(boxCode) {
        history.push(`/${boxCode}`)
    }

    useEffect(() => {
        fetchShareUrl()
    }, [])

    
    return (
        <h1>{message}</h1>
    )
}

export default ShareUrlRedirect