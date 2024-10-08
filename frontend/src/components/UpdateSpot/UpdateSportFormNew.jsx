import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadOneSpot } from "../../store/spot.js";
import { csrfFetch } from "../../store/csrf.js";

export default function UpdateSpotForm() {
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [name, setName] = useState("");
   // const [picture, setPicture] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { spotId } = useParams();
    
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSpotData = async () => {
            const currentSpot = await dispatch(loadOneSpot(spotId));
            if (currentSpot) {

                    setAddress(currentSpot.address);
                    setCity(currentSpot.city);
                    setState(currentSpot.state);
                    setCountry(currentSpot.country);
                    setLat(currentSpot.lat);
                    setLng(currentSpot.lng);
                    setDescription(currentSpot.description);
                    setPrice(currentSpot.price);
                    setName(currentSpot.name);
               //     setPicture(currentSpot.SpotImages[0]?.url || "");
            }
        };
        fetchSpotData();
    }, [dispatch, spotId]);

    const validateForm = () => {
        const error = {};
        // const { address, city, state, country, lat, lng, description, price, name } = spotData;

        if (!country) error.country = "Country is required";
        if (!address) error.address = "Street Address is required";
        if (!city) error.city = "City is required";
        if (!state) error.state = "State is required";
        if (!lat || lat > 90 || lat < -90) error.lat = "Latitude must be within -90 and 90";
        if (!lng || lng > 180 || lng < -180) error.lng = "Longitude must be within -180 and 180";
        if (!description || description.length < 30) error.description = "Description must be at least 30 characters";
        if (!name) error.name = "Name is required";
        if (!price) error.price = "Price is required";
        //if (!picture) error.picture = "Preview picture is required";

        setErrors(error);
        return Object.keys(error).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const updatedSpot = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price: Number(price).toFixed(2),
        };

        try {
            const response = await csrfFetch(`/api/spots/${spotId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedSpot),
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/spots/${data.id}`);
            } else {
                const errorData = await response.json();
                setErrors({ server: errorData.message });
            }
        } catch (err) {
            console.error("Error updating spot:", err);
            setErrors({ server: "An error occurred while updating the spot." });
        }
    };

    return (
        <form className="formBody" onSubmit={handleSubmit}>
            <div className="section">
                <h1>Update your Spot</h1>
                <h2>Where&apos;s your place located?</h2>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <div>
                    <label>
                        Country
                        {errors.country && <p className="invalid">{errors.country}</p>}
                    </label>
                    <input
                        name="country"
                        value={country}
                        placeholder="Country"
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>
                        Street Address
                        {errors.address && <p className="invalid">{errors.address}</p>}
                    </label>
                    <input
                        name="address"
                        type="text"
                        value={address}
                        placeholder="Address"
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div className="cityState">
                    <div >
                        <label>
                            City
                            {errors.city && <p className="invalid">{errors.city}</p>}
                        </label>
                        <input
                            name="city"
                            type="text"
                            value={city}
                            placeholder="City"
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </div>
                    <div >
                        <label>
                            State
                            {errors.state && <p className="invalid">{errors.state}</p>}
                        </label>
                        <input
                            name="state"
                            type="text"
                            value={state}
                            placeholder="State"
                            onChange={(e) => setState(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div >
                    <div >
                        <label>
                            Latitude
                            {errors.lat && <p className="invalid">{errors.lat}</p>}
                        </label>
                        <input
                            name="lat"
                            type="number"
                            value={lat}
                            placeholder="Latitude"
                            onChange={(e) => setLat(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>
                            Longitude
                            {errors.lng && <p className="invalid">{errors.lng}</p>}
                        </label>
                        <input
                            name="lng"
                            type="number"
                            value={lng}
                            placeholder="Longitude"
                            onChange={(e) => setLng(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div />
            <div className="section">
                <h2>Describe your place to guests</h2>
                <p>
                    Mention the best features of your space, any special amenities like
                    fast wifi or parking, and what you love about the neighborhood.
                </p>
                <textarea
                    type="text"
                    placeholder=" Please write at least 30 characters"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
                {errors.description && (
                    <p className="invalid">
                        Description needs a minimum of 30 characters
                    </p>
                )}
            </div>
            <div className="section">
                <h2> Create a title for your spot </h2>
                <p>
                    Catch guests&apos; attention with a spot title that highlights what makes
                    your place special.
                </p>
                <input
                    type="text"
                    placeholder="Name of your spot"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                {errors.name && (
                    <span className="invalid d-block"> {errors.name}</span>
                )}
            </div>
            <div className="section">
                <h2>Set a base price for your spot </h2>
                <p>
                    Competitive pricing can help your listing stand out and rank higher in
                    search results.
                </p>
                <span>
                    <span>$</span>
                    <input min="0" max="1000000"
                        type="Number"
                        placeholder="Price per night (USD)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </span>
                {errors.price && (
                    <p className="invalid"> {errors.price}</p>
                )}
            </div>

            <div className="button_create">
                <button type="submit" className="button-22" onClick={handleSubmit} >
                    Update your Spot
                </button>
            </div>
        </form>
    );
}