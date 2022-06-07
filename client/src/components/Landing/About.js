import "../../static/css/About.css"
import AboutBox from "./AboutBox"
import welcome from "../../static/images/welcome.svg"
import sync from "../../static/images/sync.svg"
import secure from "../../static/images/secure.svg"

function About() {
    return (
        <div className="about-wrap" id="About">
            <div className="about-div">
                <AboutBox attr= {{
                    svgImg: welcome ,
                    text: "We welcome new members with a very smooth user interface that makes it easy for new visitors to use the website's utilities.",
                    header: "Simplicity"
                }} />
                <AboutBox attr= {{
                    svgImg: sync ,
                    text: "Keep all your files ranging from images and videos to texts and documents in sync across your devices using a simple box code.",
                    header: "Keep It In Sync"
                }} />
                <AboutBox attr= {{
                    svgImg: secure ,
                    text: "Secure all your files by using strong passwords for your box and adding more security measures.",
                    header: "Safe"
                }} />
            </div>
        </div>
    )
}

export default About