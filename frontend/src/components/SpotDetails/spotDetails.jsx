import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadOneSpot } from "../../store/spot";
import { getSpotReviews } from "../../store/review";
import ReviewList from "./reviewList";
import './spotDetails.css'

const SpotDetail = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();

    const spot = useSelector((state) => state.spots[spotId]);
    const reviews = useSelector((state) => state.reviews[spotId]);

    const hasReviews = reviews && reviews.Reviews.length > 0;
    const totalStars = hasReviews ? reviews.Reviews.reduce((sum, review) => sum + review.stars, 0) : 0;
    const averageRating = hasReviews ? (totalStars / reviews.Reviews.length).toFixed(1) : null;


    useEffect(() => {
        dispatch(loadOneSpot(spotId))
        dispatch(getSpotReviews(spotId))
    }, [dispatch, spotId]);

    if (!spot || !spot.Owner) return null;
    if (!spot || !spot.SpotImages) return null;
    
    const previewImage = spot.SpotImages.filter(image => image.preview === true);
    const smallImages = spot.SpotImages.filter(image => image.preview === false);

    console.log("spot", spot);

    const handleReservation = () => {
        alert("Feature coming soon");
    }

    return (
        <div className="spotdetail">
            <h2>{spot.name}</h2>
            <p>{spot.city}, {spot.state}, {spot.country}</p>
            {/* dis play Spot image */}
            <div className="image_container">
                <div className="large_image image">
                    <img src={previewImage[0].url} alt={spot.name} />
                </div>
                {smallImages.map((image) => (
                    <div className="small_image image" key={image.id}>
                        <img src={image.url} alt={image.id} />
                    </div>
                ))}
            </div>
            {/* spot detail description */}
            <div className="spotdetail_small">
                <div className="spotdetail_des">
                    <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                    <p>{spot.description}</p>

                </div>
                <div className="reservation_container">
                    <div className="resrvation">
                        <div className="price_container">
                            <span id="spot_price">${spot.price}</span><span>night</span>
                        </div>

                        <div className="reservation_rating">
                            {!averageRating ? "New" : <>{averageRating} · {reviews?.Reviews?.length} {reviews?.Reviews?.length === 1 ? "Review" : "Reviews"}</>}
                        </div>
                    </div>
                    <button onClick={handleReservation}>Reserve</button>
                </div>
            </div>
            {/* display Reviews */}
            <ReviewList spotId={spotId} />
        </div>
    )

}

export default SpotDetail;