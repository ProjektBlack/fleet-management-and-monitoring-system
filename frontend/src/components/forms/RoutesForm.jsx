import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateRoute = (props) => {
    const [RouteID, setRouteID] = useState('');
    const [InitialLoc, setInitialLoc] = useState('');
    const [Destination, setDestination] = useState('');
    const [Distance, setDistance] = useState('');
    const [Duration, setDuration] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateRoute = async () => {
        try {
            const data = {
                RouteID,
                InitialLoc,
                Destination,
                Distance,
                Duration,
            };
            setLoading(true);
            await axios.post('http://localhost:2222/routes', data);
            setLoading(false);
            navigate("/routes");
        } catch (error) {
            setLoading(false);
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    };

    return (
        <div className="row">
            <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
                <h5>Create New Route Record</h5>
                <label>Route ID: </label>
                <input
                    type="number"
                    value={RouteID}
                    onChange={(e) => setRouteID(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Initial Location: </label>
                <input
                    type="text"
                    value={InitialLoc}
                    onChange={(e) => setInitialLoc(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Destination: </label>
                <input
                    type="text"
                    value={Destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Distance: </label>
                <input
                    type="number"
                    value={Distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Duration: </label>
                <input
                    type="text"
                    value={Duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="form-control"
                    required
                />
                <button
                    className="btn btn-success mx-auto d-flex mt-4 mb-4"
                    onClick={handleCreateRoute}
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default CreateRoute;