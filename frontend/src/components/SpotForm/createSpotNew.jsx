import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addNewSpot } from "../../store/spot.js";
import { csrfFetch } from "../../store/csrf.js";
import './SpotForm.css';

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
    const [picture, setPicture] = useState("");
    const [url2, setUrl2] = useState("");
    const [url3, setUrl3] = useState("");
    const [url4, setUrl4] = useState("");
    const [url5, setUrl5] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const validateForm = () => {
        const error = {};
        if (!country) error.country = "Country is required";
        if (!address) error.address = "Street Address is required";
        if (!city) error.city = "City is required";
        if (!state) error.state = "State is required";
        if (!lat || lat > 90 || lat < -90) error.lat = "Latitude must be within -90 and 90";
        if (!lng || lng > 180 || lng < -180) error.lng = "Longitude must be within -180 and 180";
        if (!description || description.length < 30) error.description = "Description must be at least 30 characters";
        if (!name) error.name = "Name is required";
        if (!price) error.price = "Price is required";
        if (!picture) error.picture = "Preview picture is required";

        setErrors(error);
        return Object.keys(error).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await csrfFetch('/api/spots/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        address,
                        city,
                        state,
                        country,
                        lat,
                        lng,
                        name,
                        description,
                        price: Number(price).toFixed(2),
                    }),
                });
                const newSpot = await response.json();
                dispatch(addNewSpot(newSpot));

                const imageUrls = [picture, url2, url3, url4, url5].filter(Boolean);
                await Promise.all(imageUrls.map((url, index) =>
                    addSpotImages(newSpot.id, { url, preview: index === 0 })
                ));

                navigate(`/spots/${newSpot.id}`);
            } catch (err) {
                console.error('Error creating spot:', err);
            }
        }
    };

    const addSpotImages = async (spotId, picture) => {
        try {
            await csrfFetch(`/api/spots/${spotId}/images`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(picture),
            });
        } catch (err) {
            console.error('Error adding spot image:', err);
        }
    };


    return (
        <form className="formBody" onSubmit={handleSubmit}>
            <div className="section">
                <h1>Create a New Spot</h1>
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
                    <div className="form-group w-70 mr-2">
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
                    <div className="form-group w-70 mr-2">
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
                <div className="ll d-flex w-100">
                    <div className="form-group w-50 mr-2">
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
                    <div className="form-group w-50">
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
                <span className="d-flex align-center">
                    <span className="d-block mr-2">$</span>
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
            <div className="section">
                <h2>Liven up your spot with photos</h2>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <p className="invalid">
                </p>
                <input
                    type="url"
                    placeholder="Preview Image URL"
                    className="url1"
                    onChange={(e) => setPicture(e.target.value)}
                />
                <label>
                    {errors.picture && <p>{errors.picture}</p>}
                </label>
                <input
                    type="url"
                    placeholder="Image URL"
                    className="url2"
                    onChange={(e) => setUrl2(e.target.value)}
                />
                <input
                    type="url"
                    placeholder="Image URL"
                    className="url3"
                    onChange={(e) => setUrl3(e.target.value)}
                />
                <input
                    type="url"
                    placeholder="Image URL"
                    className="url4"
                    onChange={(e) => setUrl4(e.target.value)}
                />
                <input
                    type="url"
                    placeholder="Image URL"
                    className="url5"
                    onChange={(e) => setUrl5(e.target.value)}
                />
            </div>
            <div className="button_create">
                <button type="submit" className="button-22" onClick={handleSubmit} >
                    Create a New Spot
                </button>
            </div>
        </form>
    );
}