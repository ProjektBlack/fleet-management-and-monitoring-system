import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateCustomer = (props) => {
    const [CustomerID, setCustomerID] = useState('');
    const [CustomerFirstName, setCustomerFirstName] = useState('');
    const [CustomerLastName, setCustomerLastName] = useState('');
    const [CustomerContactNo, setCustomerContactNo] = useState('');
    const [CustomerEmail, setCustomerEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateCustomer = async () => {
        try {
            const data = {
                CustomerID,
                CustomerFirstName,
                CustomerLastName,
                CustomerContactNo,
                CustomerEmail,
            };
            setLoading(true);
            await axios.post('http://localhost:2222/customers', data);
            setLoading(false);
            navigate("/customers");
        } catch (error) {
            setLoading(false);
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    };

    return (
        <div className="row">
            <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
                <h5>Create New Customer</h5>
                <label>Customer ID: </label>
                <input
                    type="number"
                    value={CustomerID}
                    onChange={(e) => setCustomerID(e.target.value)}
                    className="form-control"
                    required
                />
                <label>First Name: </label>
                <input
                    type="text"
                    value={CustomerFirstName}
                    onChange={(e) => setCustomerFirstName(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Last Name: </label>
                <input
                    type="text"
                    value={CustomerLastName}
                    onChange={(e) => setCustomerLastName(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Contact Number: </label>
                <input
                    type="number"
                    value={CustomerContactNo}
                    onChange={(e) => setCustomerContactNo(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Email: </label>
                <input
                    type="email"
                    value={CustomerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="form-control"
                    required
                />
                <button
                    className="btn btn-success mx-auto d-flex mt-4 mb-4"
                    onClick={handleCreateCustomer}
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default CreateCustomer;