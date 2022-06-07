import "../../static/css/Review.css"


function Review(props) {
    return (
        <div className="review-container" style={{flexDirection: props.attr.right && "row-reverse"}}>
            <div className="review-creds">
                <img className="review-img-face" src={props.attr.img} />
            </div>
            <div className="review-text" style={{alignItems: props.attr.right && "flex-end"}}>
                <p style={{textAlign: props.attr.right && "right"}} className="review-text-p poppins bold">
                <span style={{color: "var(--light-red)", fontSize: "25px", fontFamily: "Trebuchet MS"}}>“</span>{props.attr.text}<span style={{color: "var(--light-red)", fontSize: "26px", fontFamily: "Trebuchet MS"}}>”</span>
                </p>
                <p style={{fontSize: "25px"}} className="poppins bold"><span style={{color: "var(--light-red)", fontFamily: "Trebuchet MS"}}>― </span>{props.attr.author}</p>
            </div>
        </div>
    )
}    

export default Review