import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
//comments: use form, use prevent default to prevent it from reloading
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
    const [status, setStatus] = useState("");
    const [distance, setDistance] = useState("");
    const [dieselCost, setDieselCost] = useState("");
    const [dieselConsumption, setDieselConsumption] = useState("");
    const [tollFee, setTollFee] = useState("");
    const [pathway, setPathway] = useState("");
    const [totalTripCost, setTotalTripCost] = useState("");

    //get truck ID from URL params
    const { truckId } = useParams();

    //functions to automatically compute diesel consumption and total trip cost
    function handleDistanceChange(event) {
        const newDistance = event.target.value;
        const newDieselConsumption = calculateDieselConsumption(newDistance, dieselCost);
        const newTotalTripCost = calculateTotalTripCost(newDieselConsumption, tollFee, pathway);
        setDistance(newDistance);
        setDieselConsumption(newDieselConsumption);
        setTotalTripCost(newTotalTripCost);
    }

    function handleDieselCostChange(event) {
        const newDieselCost = event.target.value;
        const newDieselConsumption = calculateDieselConsumption(distance, newDieselCost);
        const newTotalTripCost = calculateTotalTripCost(newDieselConsumption, tollFee, pathway);
        setDieselCost(newDieselCost);
        setDieselConsumption(newDieselConsumption);
        setTotalTripCost(newTotalTripCost);
    }

    function handleTollFeeChange(event) {
        const newTollFee = event.target.value;
        const newTotalTripCost = calculateTotalTripCost(dieselConsumption, newTollFee, pathway);
        setTollFee(newTollFee);
        setTotalTripCost(newTotalTripCost);
    }

    function handlePathwayChange(event) {
        const newPathway = event.target.value;
        const newTotalTripCost = calculateTotalTripCost(dieselConsumption, tollFee, newPathway);
        setPathway(newPathway);
        setTotalTripCost(newTotalTripCost);
    }

    function calculateDieselConsumption(distance, dieselCost) {
        const fuelConsumption = distance / 6; // assume 10 km/liter
        const totalFuelCost = fuelConsumption * dieselCost;
        return totalFuelCost.toFixed(2);
    }

    function calculateTotalTripCost(dieselConsumption, tollFee, pathway) {
        if (!pathway) {
            const totalTripCost = parseFloat(dieselConsumption) + parseFloat(tollFee);
            return totalTripCost.toFixed(2);
        } else if (!tollFee) {
            const totalTripCost = parseFloat(dieselConsumption) + parseFloat(pathway);
            return totalTripCost.toFixed(2);
        } else {
            const totalTripCost = parseFloat(dieselConsumption) + parseFloat(tollFee) + parseFloat(pathway);
            return totalTripCost.toFixed(2);
        }
    }


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
                timeReturned,
                status,
                distance,
                dieselCost,
                dieselConsumption,
                tollFee,
                pathway,
                totalTripExpense: totalTripCost
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
            console.log(error);
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

                <label>Helper Name</label>
                <input
                    type="text"
                    className="form-control"
                    name="helperName"
                    value={helper.name}
                    onChange={(e) => setHelper({ ...helper, name: e.target.value })}
                />

                <label>Customer Name</label>
                <input
                    type="text"
                    className="form-control"
                    name="customerName"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
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
                    required
                />

                <label>Time Dispatched</label>
                <input
                    type="time"
                    className="form-control"
                    name="timeDispatched"
                    value={timeDispatched}
                    onChange={(e) => setTimeDispatched(e.target.value)}
                    required
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
                <label>Status</label>
                <input
                    type="text"
                    className="form-control"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
                <label>Distance (KM)</label>
                <input
                    type="text"
                    className="form-control"
                    name="distance"
                    value={distance}
                    onChange={handleDistanceChange}
                />
                <label>Diesel Price (/liter)</label>
                <input
                    type="text"
                    className="form-control"
                    name="dieselCost"
                    value={dieselCost}
                    onChange={handleDieselCostChange}
                />

                <label>Toll Fees</label>
                <input
                    type="text"
                    className="form-control"
                    name="tollFee"
                    value={tollFee}
                    onChange={handleTollFeeChange}
                />

                <label>Pathway Fees</label>
                <input
                    type="number"
                    className="form-control"
                    name="pathway"
                    value={pathway}
                    onChange={handlePathwayChange}
                />

                <label>Total Fuel Cost</label>
                <input
                    type="text"
                    className="form-control"
                    name="dieselConsumption"
                    value={dieselConsumption}
                    readOnly
                    disabled
                />

                <label>Total Trip Cost</label>
                <input
                    type="text"
                    className="form-control"
                    name="totalTripCost"
                    value={totalTripCost}
                    onChange={(e) => setTotalTripCost(e.target.value)}
                    readOnly
                    disabled
                />
                <button className="btn btn-success mt-4 mx-auto d-flex" onClick={handleCreateTrip}>
                    Create
                </button>
            </div>
        </div>
    );
};

export default CreateTrip;

