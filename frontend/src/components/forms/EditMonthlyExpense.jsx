import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EditMonthlyExpense = () => {
    //states for monthly expenses
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [trips, setTrips] = useState("");
    const [monthlyMaintenanceCosts, setMonthlyMaintenanceCosts] = useState("0");
    const [dieselCosts, setDieselCosts] = useState("");
    //get object id from url
    const { id, truckId } = useParams();

    //function to get monthly expense
    useEffect(() => {
        const getMonthlyExpense = async () => {
            try {
                const response = await axios.get(`http://localhost:2222/monthlyexpenses/${id}`);
                console.log(response);
                setMonth(response.data.month);
                setYear(response.data.year);
                setMonthlyMaintenanceCosts(response.data.maintenance);
                setDieselCosts(response.data.dieselConsumption);
                setTrips(response.data.totalTrips);
            } catch (error) {
                alert("Error occurred. Please check console.");
                console.error(error);
            }
        };
        getMonthlyExpense();
    }, [id]);

    //function to get and compute total trips and total fuel costs
    const computeMonthlyTotalTripsAndFuelCosts = async () => {
        try {
            const response = await axios.get(`http://localhost:2222/trips/${year}/${month}/${truckId}`);
            const trips = response.data.length;
            let totalFuelCosts = 0;
            for (let i = 0; i < trips; i++) {
                totalFuelCosts += response.data[i].dieselConsumption;
            }
            setTrips(trips);
            setDieselCosts(totalFuelCosts);
        } catch (error) {
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    }

    //function to update monthly expense
    const handleUpdateExpense = async () => {
        try {
            const data = {
                month, maintenance: monthlyMaintenanceCosts, dieselConsumption: dieselCosts, totalTrips: trips, year
            };
            const response = await axios.put(`http://localhost:2222/monthlyexpenses/${id}`, data);
            console.log(response.data)
            alert("Monthly expense is updated successfully.");
            window.history.back();
        } catch (error) {
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    };

    return (
        <div className="row">
            <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
                <h5>Update Monthly Expense</h5>
                <label>Month</label>
                <input
                    type="String"
                    className="form-control"
                    required
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                />
                <label>Year</label>
                <input
                    type="String"
                    className="form-control"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                />
                <label>Maintenance Costs:</label>
                <input
                    type="number"
                    className="form-control"
                    required
                    value={monthlyMaintenanceCosts}
                    onChange={(e) => setMonthlyMaintenanceCosts(e.target.value)}
                />
                <label>Diesel Costs:</label>
                <input
                    type="number"
                    className="form-control"
                    required
                    value={dieselCosts}
                    onChange={(e) => setDieselCosts(e.target.value)}
                    disabled
                />
                <label>Trips</label>
                <input
                    type="number"
                    className="form-control"
                    required
                    value={trips}
                    onChange={(e) => setTrips(e.target.value)}
                    disabled
                />
                <div className="row">
                    <div className="col">
                        <button className="btn btn-success mx-auto d-flex mt-4 mb-4" onClick={computeMonthlyTotalTripsAndFuelCosts}>Calculate</button>
                    </div>
                    <div className="col">
                        <button className="btn btn-success mx-auto d-flex mt-4 mb-4" onClick={handleUpdateExpense}>Edit</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default EditMonthlyExpense