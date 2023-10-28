import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

//update trip
const EditTrip = () => {
    //states for trip details
    const [driver, setDriver] = useState({
        name: "",
        licenseNumber: ""
    });
    const [customer, setCustomer] = useState({
        name: "",
        contactNumber: "",
        location: ""
    });
    const [helper, setHelper] = useState({
        name: "",
        contactNumber: ""
    });
    const [date, setDate] = useState("");
    const [timeDispatched, setTimeDispatched] = useState("");
    const [timeReceived, setTimeReceived] = useState("");
    const [timeReturned, setTimeReturned] = useState("");

    //get truck ID from URL params
    const { id } = useParams();

    useEffect(() => {
        const getTrip = async () => {
            try {
                const response = await axios.get(`http://localhost:2222/trips/${id}`);
                console.log(response);
                setDriver(response.data.driver);
                setCustomer(response.data.customer);
                setHelper(response.data.helper);
                setDate(response.data.date);
                setTimeDispatched(response.data.timeDispatched);
                setTimeReceived(response.data.timeReceived);
                setTimeReturned(response.data.timeReturned);
            } catch (error) {
                alert("Error occurred. Please check console.");
                console.error(error);
            }
        };
        getTrip();
    }, [id]);

    //function to create an expense
    const handleEditTrip = async () => {
        try {
            const data = {
                driver,
                customer,
                helper,
                date,
                timeDispatched,
                timeReceived,
                timeReturned
            };
            const response = await axios.put(`http://localhost:2222/trips/${id}`, data);
            console.log(response.data);
            alert("Trip updated.");
        } catch (error) {
            alert("Error occurred.");
            console.error(error);
        }
    };

    return (
        <div className="row">
            <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
                <h5>Create New Trip</h5>
                <label>Driver Name</label>
                <input
                    type="text"
                    className="form-control"
                    name="driverName"
                    value={driver.name}
                    onChange={(e) => setDriver({ ...driver, name: e.target.value })}
                />

                <label>Driver License Number</label>
                <input
                    type="text"
                    className="form-control"
                    name="driverLicenseNumber"
                    value={driver.licenseNumber}
                    onChange={(e) => setDriver({ ...driver, licenseNumber: e.target.value })}
                />

                <label>Helper Name</label>
                <input
                    type="text"
                    className="form-control"
                    name="helperName"
                    value={helper.name}
                    onChange={(e) => setHelper({ ...helper, name: e.target.value })}
                />

                <label>Helper Contact Number</label>
                <input
                    type="text"
                    className="form-control"
                    name="helperContactNumber"
                    value={helper.contactNumber}
                    onChange={(e) => setHelper({ ...helper, contactNumber: e.target.value })}
                />

                <label>Customer Name</label>
                <input
                    type="text"
                    className="form-control"
                    name="customerName"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                />

                <label>Customer Contact Number</label>
                <input
                    type="text"
                    className="form-control"
                    name="customerContactNumber"
                    value={customer.contactNumber}
                    onChange={(e) => setCustomer({ ...customer, contactNumber: e.target.value })}
                />

                <label>Customer Location</label>
                <input
                    type="text"
                    className="form-control"
                    name="customerLocation"
                    value={customer.location}
                    onChange={(e) => setCustomer({ ...customer, location: e.target.value })}
                />

                <label>Date</label>
                <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <label>Time Dispatched</label>
                <input
                    type="time"
                    className="form-control"
                    name="timeDispatched"
                    value={timeDispatched}
                    onChange={(e) => setTimeDispatched(e.target.value)}
                />

                <label>Time Received</label>
                <input
                    type="time"
                    className="form-control"
                    name="timeReceived"
                    value={timeReceived}
                    onChange={(e) => setTimeReceived(e.target.value)}
                />

                <label>Time Returned</label>
                <input
                    type="time"
                    className="form-control"
                    name="timeReturned"
                    value={timeReturned}
                    onChange={(e) => setTimeReturned(e.target.value)}
                />
                <button className="btn btn-success mt-4 mx-auto d-flex" onClick={handleEditTrip}>
                    Edit
                </button>
            </div>
        </div>
    );
};

export default EditTrip;

