import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateShipment = (props) => {
    const [ShipmentID, setShipmentID] = useState('');
    const [ShipmentDate, setShipmentDate] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateShipment = async () => {
        try {
            const data = {
                ShipmentID,
                ShipmentDate,
            };
            setLoading(true);
            await axios.post('http://localhost:2222/shipments', data);
            setLoading(false);
            navigate("/shipments");
        } catch (error) {
            setLoading(false);
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    };

    return (
        <div className="row">
            <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
                <h5>Create New Shipment Record</h5>
                <label>Shipment ID: </label>
                <input
                    type="number"
                    value={ShipmentID}
                    onChange={(e) => setShipmentID(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Shipment Date: </label>
                <input
                    type="date"
                    value={ShipmentDate}
                    onChange={(e) => setShipmentDate(e.target.value)}
                    className="form-control"
                    required
                />
                <button
                    className="btn btn-success mx-auto d-flex mt-4 mb-4"
                    onClick={handleCreateShipment}
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default CreateShipment;