import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllSpots } from "../../store/spot";
import { Link } from "react-router-dom";
import "./SpotGrid.css";


export default function SpotList() {
    const dispatch = useDispatch();
    const [toolTip, setToolTip] = useState(null);
    const spots = useSelector((state) => state.spots)
    // console.log('spots', spots)

    useEffect(() => {
        dispatch(loadAllSpots());
    }, [dispatch])

    const spotsArr = Object.values(spots)

    return (
        <>
            <div className="SpotGrid">
                {spotsArr.map((spot) =>
                    <>
                        <div
                                key={spot?.id} 
                                value={toolTip}
                                onMouseOut={()=>setToolTip(null)}
                                onMouseOver={()=>setToolTip(spot.id)}
                                className="toolTip">


                            <Link key={spot?.id}
                                to={`/spots/${spot.id}`} style={{ textDecoration: 'none' }}>

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
                                {toolTip === spot.id? <h4>{spot.name}</h4> : <h3 className="no-show">holding place</h3>}
                            </Link>
                        </div>

                    </>
                )
                }</div >
        </>
    )
}