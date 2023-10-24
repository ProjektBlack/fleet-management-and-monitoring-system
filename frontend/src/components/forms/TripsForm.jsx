import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const CreateTrip = () => {
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState("option1");

    //states for trip details
    const [driver, setDriver] = useState({
        name: "John Doe",
        licenseNumber: "0000-0000-0000"
    });
    const [customer, setCustomer] = useState({
        name: "John Doe",
        contactNumber: "0000-0000-0000",
        location: "default location"
    });
    const [helper, setHelper] = useState({
        name: "John Doe",
        contactNumber: "0000-0000-0000"
    });
    const [date, setDate] = useState("");
    const [timeDispatched, setTimeDispatched] = useState("");
    const [timeReceived, setTimeReceived] = useState("");
    const [timeReturned, setTimeReturned] = useState("");

    //get truck ID from URL params
    const { truckId } = useParams();

    //function to create an expense
    const handleCreateTrip = async () => {
        //construct message body
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
            setLoading(true);
            const response = await axios.post('http://localhost:2222/trips', data);
            const newObjectID = response.data._id;
            //get the truck object
            const getObject = await axios.get(`http://localhost:2222/trucks/${truckId}`);
            getObject.data.trips.push(newObjectID);
            await axios.put(`http://localhost:2222/trucks/${truckId}`, getObject.data);
            setLoading(false);
            //use better alerts
            alert("Trip created.");
        } catch (error) {
            setLoading(false);
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
                <button className="btn btn-success mt-4 mx-auto d-flex" onClick={handleCreateTrip}>
                    Create
                </button>
            </div>
        </div>
    );
};

export default CreateTrip;

