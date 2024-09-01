import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, getSpotReviews } from "../../store/review";
import { useModal } from '../../context/Modal';
import ReviewFormModal from "../SpotDetails/reviewFormModal";
import "./reviewList.css";


const ReviewList = ({ spotId }) => {
    const dispatch = useDispatch();
    const { setModalContent, setOnModalClose, closeModal } = useModal();

    const reviews = useSelector((state) => state.reviews[spotId]);
    const currentSpot = useSelector((state) => state.spots[spotId]);
    const currentUser = useSelector((state) => state.session.user);

    useEffect(() => {
        dispatch(getSpotReviews(spotId));
    }, [dispatch, spotId]);

    const hasReviews = reviews?.Reviews?.length > 0;

    const totalStars = hasReviews
        ? reviews.Reviews.reduce((sum, { stars }) => sum + stars, 0)
        : 0;

    const averageRating = hasReviews
        ? (totalStars / reviews.Reviews.length).toFixed(1)
        : null;

    const hasReviewed = hasReviews && currentUser
        ? reviews.Reviews.some(({ userId }) => userId === currentUser.id)
        : false;

    const isOwner = currentUser?.id === currentSpot?.ownerId;

    const openReviewModal = () => {
        setOnModalClose(() => { });
        setModalContent(<ReviewFormModal spotId={spotId} onSubmitSuccess={() => dispatch(getSpotReviews(spotId))}
        />);
    };

    const handleDeleteClick = (reviewId) => {
        setModalContent(
            <div className="confirm_deletion">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this review?</p>
                <div className="two-buttons">
                    <button
                        className="button-22"
                        onClick={() => handleDeleteConfirm(reviewId, spotId)}
                    >
                        Yes (Delete Review)
                    </button>
                    <button className="button-22" onClick={closeModal}>
                        No (Keep Review)
                    </button>
                </div>

            </div>
        );
    };

    const handleDeleteConfirm = async (reviewId, spotId) => {
        await dispatch(deleteReview(reviewId, spotId));
        closeModal();
    };

    return (
        <div className="reviewlist">
            {hasReviews ? (
                <>
                    <h3>
                        🐟 {averageRating} · {reviews.Reviews.length} {reviews.Reviews.length === 1 ? "Review" : "Reviews"}
                    </h3>

                    {/* Show "Post Your Review" button if user hasn't reviewed yet and isn't the owner */}
                    {!hasReviewed && !isOwner && currentUser && (
                        <button className="post-review-button" onClick={openReviewModal}>
                            Post Your Review
                        </button>
                    )}

                    {/* Render sorted reviews */}
                    {reviews.Reviews
                        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                        .map((review) => {
                            const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(review.updatedAt));

                            return (
                                <div key={review.id} className="reviewList_small_container">
                                    <h3>{review.User?.firstName || (currentUser && currentUser.firstName)}</h3>
                                    <p>{formattedDate}</p>
                                    <p>{review.review}</p>

                                    {/* Show "Delete" button if current user is the author of the review and not the owner */}
                                    {currentUser && currentUser.id === review.userId && !isOwner && (
                                        <button className="delete-review-button" onClick={() => handleDeleteClick(review.id)}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                </>
            ) : (
                currentUser && !isOwner ? (
                    <>
                        <h2>🐟 New</h2>
                        <p>Be the first to post a review!</p>
                        <button className="post-review-button" onClick={openReviewModal}>
                            Post Your Review
                        </button>
                    </>
                ) : (
                    <h2>🐟 New</h2>
                )
            )}
        </div>
    );
};



export default ReviewList;