import redImage from "../../static/images/red_image.svg"

function ImageStructure(props) {
    return (
        <div style={{display: "flex", alignItems: "flex-start", justifyContent: "flex-start", userSelect: "none", marginBottom: "10px", borderRadius: "6px", padding: "3px"}}>
                <span style={{visibility: "hidden"}} class="material-icons">
                    chevron_right
                </span>
                <img src={redImage} style={{maxWidth: "25px"}} />
                <p style={{marginLeft: "10px", wordBreak: "break-all"}} className="poppins bold">{props.idMapping[props.fileId].name}</p>
            </div>
    )
}

export default ImageStructure