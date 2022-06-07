import "../../static/css/Navbar.css"
import {useState} from 'react'
function Navbar() {

    // navbar focus
    const [chosen, setChosen] = useState("Home")
    
    const shakeHome = item => {
        let contentBox = document.getElementById("content-box-id")
        contentBox.classList.remove("swing-in-top-fwd")
        contentBox.classList.toggle("vibrate-1")
        item.currentTarget.classList.toggle("vibrate-1");
        setTimeout((e) => {
            e.classList.toggle("vibrate-1")
            contentBox.classList.toggle("vibrate-1")
        }
        , 1000, item.currentTarget)
        
    }   

    return (
        <div className="navbar-wrap">
            <div className="navbar-div swing-in-top-fwd">
                <a
                    onClick={() => setChosen("About")}
                    style={{borderRadius: "8px 0px 0px 8px"}}
                    href="#About"
                    className={`poppins bold navbar-text ${chosen === "About" ? "chosen" : ""}`}>
                    About
                </a>
                <a 
                    onClick={() => setChosen("Community")}  
                    href="#Community"
                    className={`poppins bold navbar-text ${chosen === "Community" ? "chosen" : ""}`}>
                    Community
                </a>
                <div 
                    onClick={(item) => {
                        setChosen("Home");
                        if (chosen === "Home") {
                            shakeHome(item)
                        }}
                    } 
                    className={`navbar-home-circle ${chosen === "Home" ? "chosen" : ""}`}>
                    <span class="material-icons-outlined home-icon">
                        home
                    </span>
                </div>
                <a 
                    onClick={() => setChosen("Guide")}
                    href="#Guide" 
                    className={`poppins bold navbar-text ${chosen === "Guide" ? "chosen" : ""}`}> 
                    Guide
                </a>
                <a 
                    onClick={() => setChosen("Feedback")} 
                    href="#Feedback"
                    style={{borderRadius: "0px 8px 8px 0px"}}
                    className={`poppins bold navbar-text ${chosen === "Feedback" ? "chosen" : ""}`}>
                    Feedback
                </a>
            </div>
        </div>
    )
}

export default Navbar