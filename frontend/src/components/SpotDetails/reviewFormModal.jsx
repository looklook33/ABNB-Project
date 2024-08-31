import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createReview } from '../../store/review';
import './spotDetails.css'
import { FaFishFins } from "react-icons/fa6";

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);

  const handleClick = (ratingValue) => {
    setRating(ratingValue);
  };

  const handleMouseEnter = (ratingValue) => {
    setHover(ratingValue);
  };

  const handleMouseLeave = () => {
    setHover(0);
  };

  return (
    <div className='star-rating'>
      {Array.from({ length: 5 }, (_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type='radio'
              name='rating'
              value={ratingValue}
              onClick={() => handleClick(ratingValue)}
              style={{ display: 'none' }} // Hide the input element
            />
            < FaFishFins
              className='star'
              color={ratingValue <= (hover || rating) ? '#0734ff' : '#e4e5e9'}
              size={30}
              onMouseEnter={() => handleMouseEnter(ratingValue)}
              onMouseLeave={handleMouseLeave}
            />
          </label>
        );
      })}
    </div>
  );
};

const ReviewFormModal = ({ spotId, onSubmitSuccess }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReview = { review, stars };
    await dispatch(createReview(newReview, spotId));
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="review_form">
      <h1>How was your stay?</h1>
      <textarea
        placeholder="Leave your review here..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <div className='star_div'><span>Stars:</span><span><StarRating rating={stars} setRating={setStars} /></span></div>
      <button className='button-22' type="submit" disabled={review.length < 10 || stars === 0}>
        Submit Your Review
      </button>
    </form>
  );
};

export default ReviewFormModal;