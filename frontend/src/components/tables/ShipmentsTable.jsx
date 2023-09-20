import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
//import components
import Sidebar from "../Sidebar";
import Spinner from "../Spinner";
import { Shipment } from "../../../../backend/models/models";
//table's kinda squished - change layout later
//general analysis of how this works
const ShipmentsTable = () => {
    // rendering load states
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(false);

    // get data
    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:2222/shipment")
            .then((response) => {
                setShipments(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }, [])

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <div style={{ overflowX: "auto", marginLeft: "17%" }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Shipment ID</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* renders the information */}
                            {shipments.map((shipment, index) => (
                                <tr key={shipment.ShipmentID}>
                                    <td>{shipment.ShipmentID}</td>
                                    <td>{shipment.ShipmentDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ShipmentsTable;