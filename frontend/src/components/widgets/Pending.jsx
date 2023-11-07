import axios from "axios";
import React from "react";
import { BsFillTruckFrontFill } from "react-icons/bs";
import { useEffect, useState } from "react";

const PendingWidget = () => {
    const [pendingTrips, setPendingTrips] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:2222/trips/status/pending")
            .then((res) => {
                setPendingTrips(res.data.length);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div id="pendingWidget" className="col-2">
            <div className="row text-center">
                <div className="col">
                    <BsFillTruckFrontFill />
                    <h6 id="pendingTrips">{pendingTrips}</h6>
                    <h6>Pending Trips</h6>
                </div>
            </div>
        </div>
    )
}

export default PendingWidget;