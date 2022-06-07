import "../../static/css/AboutBox.css"

function AboutBox(props) {
    return (
        <div className="about-box-div">
            <img className="about-svg-img" src={props.attr.svgImg} />
            <h2 className="poppins bold about-container-header">{props.attr.header}</h2>
            <p className="about-p poppins bold">{props.attr.text}</p>
        </div>
    )
}

export default AboutBox