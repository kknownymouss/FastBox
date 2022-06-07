import Content from "./Content"
import "../../static/css/Landing.css"
import Navbar from "./Navbar"
import bg from "../../static/images/bg3.png"


function Landing() {
    return (
        <div style={{backgroundImage: `url(${bg})`}} className="landing-wrap">
            <Navbar />
            <Content />
        </div>
    )
}

export default Landing