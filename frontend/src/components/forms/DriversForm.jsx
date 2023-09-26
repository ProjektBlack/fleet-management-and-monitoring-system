import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateDriver = (props) => {
    const [DriverID, setDriverID] = useState('');
    const [DriverFirstName, setDriverFirstName] = useState('');
    const [DriverLastName, setDriverLastName] = useState('');
    const [DriverContactNo, setDriverContactNo] = useState('');
    const [DriverLicenseNo, setDriverLicenseNo] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateDriver = async () => {
        try {
            const data = {
                DriverID,
                DriverFirstName,
                DriverLastName,
                DriverContactNo,
                DriverLicenseNo,
            };
            setLoading(true);
            await axios.post('http://localhost:2222/drivers', data);
            setLoading(false);
            navigate("/drivers");
        } catch (error) {
            setLoading(false);
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    };

    return (
        <div className="row">
            <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
                <h5>Create New Driver Record</h5>
                <label>Driver ID: </label>
                <input
                    type="number"
                    value={DriverID}
                    onChange={(e) => setDriverID(e.target.value)}
                    className="form-control"
                    required
                />
                <label>First Name: </label>
                <input
                    type="text"
                    value={DriverFirstName}
                    onChange={(e) => setDriverFirstName(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Last Name: </label>
                <input
                    type="text"
                    value={DriverLastName}
                    onChange={(e) => setDriverLastName(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Contact Number: </label>
                <input
                    type="number"
                    value={DriverContactNo}
                    onChange={(e) => setDriverContactNo(e.target.value)}
                    className="form-control"
                    required
                />
                <label>License Number: </label>
                <input
                    type="text"
                    value={DriverLicenseNo}
                    onChange={(e) => setDriverLicenseNo(e.target.value)}
                    className="form-control"
                    required
                />
                <button
                    className="btn btn-success mx-auto d-flex mt-4 mb-4"
                    onClick={handleCreateDriver}
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default CreateDriver;