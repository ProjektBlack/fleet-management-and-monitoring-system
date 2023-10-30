import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

//update trip
const EditTrip = () => {
    //states for trip details
    const [driver, setDriver] = useState({ name: "" });
    const [customer, setCustomer] = useState({
        name: "John Doe",
        location: "default location"
    });
    const [helper, setHelper] = useState({ name: "John Doe" });
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
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
    const { id } = useParams();
    //navigation
    const navigate = useNavigate();

    useEffect(() => {
        const getTrip = async () => {
            try {
                const response = await axios.get(`http://localhost:2222/trips/${id}`);
                console.log(response);
                setDriver(response.data.driver);
                setCustomer(response.data.customer);
                setHelper(response.data.helper);
                setYear(response.data.year);
                setMonth(response.data.month);
                setDay(response.data.day);
                setTimeDispatched(response.data.timeDispatched);
                setTimeReceived(response.data.timeReceived);
                setTimeReturned(response.data.timeReturned);
                setStatus(response.data.status);
                setDistance(response.data.distance);
                setDieselCost(response.data.dieselCost);
                setDieselConsumption(response.data.dieselConsumption);
                setTollFee(response.data.tollFee);
                setPathway(response.data.pathway);
                setTotalTripCost(response.data.totalTripExpense);
            } catch (error) {
                alert("Error occurred. Please check console.");
                console.error(error);
            }
        };
        getTrip();
    }, [id]);

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
    const handleEditTrip = async () => {
        try {
            const data = {
                truck: id,
                driver,
                customer,
                helper,
                year,
                month,
                day,
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
            const response = await axios.put(`http://localhost:2222/trips/${id}`, data);
            console.log(response.data);
            alert("Trip updated.");
            window.history.back();
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

                <label>Year</label>
                <input
                    type="string"
                    className="form-control"
                    name="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                />

                <label>Month</label>
                <input
                    type="string"
                    className="form-control"
                    name="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                />

                <label>Day</label>
                <input
                    type="string"
                    className="form-control"
                    name="day"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    required
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

                <button className="btn btn-success mt-4 mx-auto d-flex" onClick={handleEditTrip}>
                    Edit
                </button>
            </div>
        </div>
    );
};

export default EditTrip;

//trip expenses
//distance, 1 liter = 6 km, formula totalDistance/6 = totalLiters*dieselCost, toll fee
//monthly
//total cost of diesel, totalLiters * dieselPrice, 