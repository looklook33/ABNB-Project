import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserSpots, deleteSpot } from "../../store/spot";
import { Link } from "react-router-dom";
import { useModal } from "../../context/Modal";
import './manageSpots.css'


const ManageSpots = () => {

    const { setModalContent, closeModal } = useModal();
    const current = useSelector((state) => state.session.user)
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots)
    const spotsArr = Object.values(spots)
    const OwnerSpots = spotsArr.filter(spot => spot.ownerId === current.id)


    useEffect(() => {
        dispatch(getCurrentUserSpots());
    }, [dispatch]);

    if (!spots) return null;

    const handleDeleteClick = (spotId) => {
        setModalContent(
            <div className="confirm_deletion">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to remove this spot?</p>
                <div className="two-buttons">
                    <button
                        className="button-22"
                        onClick={() => handleDeleteConfirm(spotId)}
                    >
                        Yes (Delete Spot)
                    </button>
                    <button className="button-22" onClick={closeModal}>
                        No (Keep Spot)
                    </button>
                </div>


            </div>
        );
    };

    const handleDeleteConfirm = async (spotId) => {
        await dispatch(deleteSpot(spotId));
        closeModal();
    }

    return (
        <div>
            <h1>Manage Spots</h1>
            <button className="button-22"><Link to={'/spots/new'}>Create a New Spot</Link></button>
            <div className="SpotGrid">

                {OwnerSpots.map((spot) =>

                    <div key={spot?.id} >
                        <Link key={`{spot.id}`}
                            to={`/spots/${spot.id}`} style={{ textDecoration: 'none' }}>
                            {/* spots grid display */}
                            <div className="SpotGridItem">
                                <img src={spot.previewImage ? spot.previewImage : "/images/placeholder.png"} alt="previewImage" />
                                <div className="SpotGridItemDescription">
                                    <div className="SpotGridItemFirstRow">
                                        <div><strong>{spot.city}, {spot.state}</strong></div>
                                        <div className="SpotGridItemStarRating">🐟 {spot.avgRating && spot.avgRating !== "No rating yet." ? spot.avgRating.toFixed(1) : "New"}</div>
                                    </div>
                                    <div className="SpotGridItemPrice"><strong>${spot.price}</strong> night</div>
                                </div>
                            </div>
                        </Link>

                        <div className="manage_spot_buttons" >
                            <button className="button-22"><Link to={`/spots/${spot.id}/edit`}>Update</Link></button>
                            <button className="button-22" onClick={() => handleDeleteClick(spot.id)}>Delete</button>
                        </div>
                    </div>
                )}
            </div >
        </div>
    )
}


export default ManageSpots