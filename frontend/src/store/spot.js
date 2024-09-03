import { csrfFetch } from "./csrf";

const DELETE_SPOT = "spot/DELETE_SPOT"
const LOAD_SPOT = "spot/LOAD_SPOT";
const LOAD_ONE_SPOT = "spot/LOAD_ONE_SPOT";
const CREATE_SPOT = "spot/CREATE_SPOT";

const CREATE_IMAGE = "image/CREATE_IMAGE";

const loadSpot = (spots) => {
  return {
    type: LOAD_SPOT,
    spots,
  };
};

const loadSingleSpot = (spot) => {
  return {
    type: LOAD_ONE_SPOT,
    spot,
  };
};

const addSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    spot,
  };
};

const removeSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId,
  }
}

const createImage = (spot) => {
  return {
    type: CREATE_IMAGE,
    payload: spot,
  };
};

export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete spot.");
    }

    dispatch(removeSpot(spotId));
    return { message: "Successfully deleted" };
  } catch (error) {
    return { error: error.message };
  }
};

export const loadAllSpots = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots");

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to load spots.");
    }

    const spots = await response.json();
    dispatch(loadSpot(spots.Spots));
    return spots.Spots;
  } catch (error) {
    return { error: error.message };
  }
};


export const loadOneSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to load spot.");
    }

    const spot = await response.json();
    dispatch(loadSingleSpot(spot));
    return spot;
  } catch (error) {
    return { error: error.message };
  }
};


export const getCurrentUserSpots = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/spots/current');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to load current user's spots.");
    }

    const spots = await response.json();
    dispatch(loadSpot(spots.Spots));
    return spots.Spots;
  } catch (error) {
    return { error: error.message };
  }
};

export const addNewSpot = (spot) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spot),
    });

    if (!response.ok) {
      const { errors } = await response.json();
      throw new Error(errors);
    }

    const newSpot = await response.json();
    dispatch(addSpot(newSpot));
    dispatch(loadAllSpots());
    return newSpot;
  } catch (error) {
    return error.message;
  }
}

export const addImage = (image) => async (dispatch) => {
  // console.log("image in store", image);
  const { spotId, url, preview } = image;
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, preview }),
  });
  if (response.ok) {
    const newImage = await response.json();
    // console.log("newImage in store", newImage);
    dispatch(createImage(newImage));
    return newImage;
  } else {
    const error = await response.json();
    // console.log("error--->", error);
    return error;
  }
};

const initialState = {};
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOT: {
      const newState = { ...state };
      action.spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;
    }
    case LOAD_ONE_SPOT: {
      const newState = { ...state };
      newState[action.spot.id] = action.spot;
      return newState;
    }
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState[action.spotId];
      return newState;
    }
    case CREATE_SPOT: {
      const newState = { ...state };
      newState[action.spot.id] = action.spot;
      return newState;
    }
    case CREATE_IMAGE: {
      // console.log("in the reducer", newState);
      return { ...state, [action.payload.id]: action.image };
    }
    default:
      return state;
  }
}

export default spotsReducer;