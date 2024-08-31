import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllSpots } from "../../store/spot";
import { NavLink } from "react-router-dom";
import "./SpotGrid.css";


export default function SpotList() {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots)
    // console.log('spots', spots)

    useEffect(() => {
        dispatch(loadAllSpots());
    }, [dispatch])

    const spotsArr = Object.values(spots)

    return (
        <>
            <div className="SpotGrid">
                {spotsArr.map((spot, i) =>
                    <NavLink key={i} to={`/spots/${spot.id}`} style={{ textDecoration: 'none' }}>
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
                    </NavLink>)
                }</div >
        </>
    )
}