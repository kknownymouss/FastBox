import "../../static/css/Community.css"
import Review from "./Review"
import comm_bg from "../../static/images/comm-bg1.jpg"
import f1 from "../../static/images/img1.png"
import f2 from "../../static/images/img2.png"
import f3 from "../../static/images/img3.png"

function Community() {
    return (
        <div id="Community" style={{backgroundImage: `url(${comm_bg})`}} className="community-wrap">
            <Review attr={{
                right: false,
                text: " FastBox is really a great tool to share your files and documents effortlessly with your friends and family. Ever since I started using it, I've saved a significant amount of time and effort when it comes to sharing. ",
                author: "Violet D.",
                img: f1
            }} />
            <Review attr={{
                right: true,
                text: " This tool is also great when it comes to sharing work related files and documents with your work partners. No setup required, no registration and no complication. Simply great. ",
                author: "Alex F.",
                img: f3
            }} />
            <Review attr={{
                right: false,
                text: " Despite my old age and my difficulties with technology, Fastbox is even so simple for the likes of me. Everything works smoothly just with the use of a simple code.",
                author: "Catharina L.",
                img: f2
            }} />
        </div>
    )
}


export default Community