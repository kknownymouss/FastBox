import "../../static/css/Content.css"
import image from "../../static/images/images.svg"
import text from "../../static/images/text.svg"
import video from "../../static/images/video.svg"
import {useEffect, useState, useRef} from "react"
import ContentBox from "./ContentBox"

function Content() {

    // image change animation
    const [currSvg, setCurrSvg] = useState(0)
    const svgDiv = useRef(null)
    const slides = [image, video, text]

    // trigger animation interval on mount
    useEffect(() => {
       setInterval((e) => {
           e.classList.toggle("swing-out-top-bck")
           e.classList.toggle("swing-in-top-fwd")
           setTimeout(() => {setCurrSvg((prevState) => {
                if (prevState < 2) {
                    return prevState += 1
                }
                return 0
            })
            setTimeout(() => {
                e.classList.toggle("swing-out-top-bck")
                e.classList.toggle("swing-in-top-fwd")
            }, 400)
        }, 400)
        }, 4000, svgDiv.current)
    }, [])


    return (
        <div className="content-wrap">
            <div className="fastbox-header-div swing-in-top-fwd">
                <h1 className="poppins normal fastbox-header">What is <span className="bold">FastBox</span> ?</h1>
                <p className="poppins normal fastbox-header-p">FastBox is a simple service that allows you to share your files with everyone and across all your devices for <span className="bold">24 hours</span> using a simple box code.</p>
                <div ref={svgDiv} className="content-svg-div swing-in-top-fwd">
                    <img className="content-svg" src={slides[currSvg]} />
                </div>
                
            </div>
            <ContentBox />
        </div>
    )
}

export default Content