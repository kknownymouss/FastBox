import "../../static/css/Footer.css"
import bg2 from "../../static/images/bg2.png"

function Footer() {
    return (
        <div id="Feedback" style={{backgroundImage: `url(${bg2})`}} className="footer-wrap">
            <div className="footer-1">
                <p className="footer-p poppins">
                    FastBox aims to provide its users with fast scalable solutions for file managment difficulties. We put the user's comfort above anything else when it comes to developement. We encourage users to not abuse the site's utilities and to abstain from trying anything that may break the website.
                </p>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly", height: "100%"}}>
                    <p className="poppins bold footer-input-header">
                        We would like to hear your<br></br><span style={{color: "var(--light-red)"}}>Feedback</span>
                    </p>
                    <div className="footer-input-div">
                        <input className="footer-input poppins bold">
                        </input>
                        <button className="footer-button">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            <div className="footer-2">
                <p className="poppins bold footer-2-p">FastBox.</p>
                <p className="poppins bold footer-2-p">Copyright © 2022, FastBox - All Rights Reserved.</p>
            </div>
        </div>
    )
}

export default Footer