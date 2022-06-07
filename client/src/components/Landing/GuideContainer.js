import "../../static/css/GuideContainer.css"

function GuideContainer(props) {
    return (
        <div className="guide-container-wrap">
            <img src={props.attr.img} className="guide-container-img" />
            <h1 className="poppins bold guide-container-header">{props.attr.header}</h1>
            <p className="poppins bold guide-container-p">{props.attr.p}</p>
        </div>
    )
}

export default GuideContainer