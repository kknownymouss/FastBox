import logo from "../../static/images/FastBox.png"
import {useHistory} from "react-router-dom"
import "../../static/css/BoxNotFound.css"

function BoxNotFound() {

    const history = useHistory()

    return(
    <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", backgroundColor: "lightgray"}}>
        <img src={logo} className="box-not-found-logo" />
        <h1 className="bold poppins" style={{fontSize: "22px", textAlign: "center", marginBottom: "10px"}}>Oops something went wrong ...<br></br>The box you requested was either not found or you are not authorized to access it.</h1>
        <button onClick={() => history.push("/")} style={{fontSize: "20px"}} className="content-button">Back To Home</button>
    </div>
    )
}


export default BoxNotFound