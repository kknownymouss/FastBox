import "../../static/css/Guide.css"
import GuideContainer from "./GuideContainer"
import img1 from "../../static/images/box.png"
import img2 from "../../static/images/upload.png"
import img3 from "../../static/images/share.png"


function Guide() {
    return (
        <div className="guide-wrap" id="Guide">
            <div className="guide-containers-wrap">
                <GuideContainer attr={{
                    img: img1,
                    header: "Step 1",
                    p: "Start by generating a random box code by entering a box name of your choice. You will then be prompted to assign a password for that box. After a password has been set, the box will be ready to use."
                }} />
                <GuideContainer attr={{
                    img: img2,
                    header: "Step 2",
                    p: "After creating the box, you will now be able to upload your files, documents and images to the box. You can also organize your files by creating folders and naming files as you wish."
                }} />
                <GuideContainer attr={{
                    img: img3,
                    header: "Step 3",
                    p: "Now, the box is populated with all your files and it is ready to be shared with people. All you have to do is give the person the box code and its password and he will be able to connect and view the contents of your box."
                }} />
            </div>
        </div>
    )
}

export default Guide