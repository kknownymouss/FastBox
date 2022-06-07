import "../../static/css/BoxNotFound.css"
import logo from "../../static/images/FastBox.png"

function BoxLoading() {

    return(
    <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", backgroundColor: "lightgray"}}>
        <img src={logo} className="box-not-found-logo" />
        <div style={{marginLeft: "0px"}} class="lds-ellipsis"><div style={{backgroundColor: "var(--light-red)", width: "15px", height: "15px"}}></div><div style={{backgroundColor: "var(--light-red)", width: "15px", height: "15px"}}></div><div style={{backgroundColor: "var(--light-red)", width: "15px", height: "15px"}}></div><div style={{backgroundColor: "var(--light-red)", width: "15px", height: "15px"}}></div></div>
    </div>
    )
}


export default BoxLoading