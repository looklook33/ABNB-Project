import { csrfFetch } from "./csrf";

// Action Types
const LOAD_ALL_REVIEWS = "spot/LOAD_ALL_REVIEWS";
const CREATE_REVIEW = "spot/CREATE_REVIEW";
const DELETE_REVIEW = "spot/DELETE_REVIEW";

// Action Creators
const loadSpotReviews = (spotId, reviews) => ({
  type: LOAD_ALL_REVIEWS,
  payload: { spotId, reviews },
});

const addReview = (review) => ({
  type: CREATE_REVIEW,
  payload: review,
});

const removeReview = (reviewId, spotId) => ({
  type: DELETE_REVIEW,
  payload: { reviewId, spotId },
});

// Thunk Action Creators
export const getSpotReviews = (spotId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/spots/${spotId}/reviews`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to load reviews.");
    }

    const reviews = await response.json();
    dispatch(loadSpotReviews(spotId, reviews));
    return reviews;
  } catch (error) {
    return { error: error.message };
  }
};

export const createReview = (review, spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create review.");
    }

    const newReview = await response.json();
    dispatch(addReview(newReview));
    return newReview;
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteReview = (reviewId, spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete review.");
    }

    dispatch(removeReview(reviewId, spotId));
    return { message: "Successfully deleted" };
  } catch (error) {
    return { error: error.message };
  }
};

// Reducer
const initialState = {};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_REVIEWS: {
      const { spotId, reviews } = action.payload;
      return {
        ...state,
        [spotId]: reviews,
      };
    }
    case CREATE_REVIEW: {
      const review = action.payload;
      const spotId = review.spotId;
      const spotReviews = state[spotId]?.Reviews || [];
      return {
        ...state,
        [spotId]: {
          ...state[spotId],
          Reviews: [...spotReviews, review],
        },
      };
    }
    case DELETE_REVIEW: {
      const { reviewId, spotId } = action.payload;
      return {
        ...state,
        [spotId]: {
          ...state[spotId],
          Reviews: state[spotId].Reviews.filter(
            (review) => review.id !== reviewId
          ),
        },
      };
    }
    default:
      return state;
  }
};

export default reviewsReducer;