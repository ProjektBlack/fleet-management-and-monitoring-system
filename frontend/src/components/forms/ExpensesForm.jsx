import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

//ui cleanup: icons, buttons 
//bug: gets all trips correctly, but not the linked truck
//create states to disable certain buttons when key fields are not filled and states are not updated

const CreateExpense = () => {
    const [loading, setLoading] = useState(false); //loading is not used here
    const [selectedType, setSelectedType] = useState("option1");

    //states for yearly expenses
    const [year, setYear] = useState("");
    const [ltoFees, setLtoFees] = useState("0");
    const [fcieFees, setFcieFees] = useState("0");
    const [miscStickerFees, setMiscStickerFees] = useState("0");
    const [maintenanceCosts, setMaintenanceCosts] = useState("0");
    const [totalDieselConsumption, setTotalDieselConsumption] = useState("");
    const [totalExpenses, setTotalExpenses] = useState("0");
    const [totalTrips, setTotalTrips] = useState("");
    //states for monthly expenses
    const [month, setMonth] = useState("");
    const [trips, setTrips] = useState("");
    const [monthlyMaintenanceCosts, setMonthlyMaintenanceCosts] = useState("0");
    const [dieselCosts, setDieselCosts] = useState("");

    // set the expense ID state to the ID from the URL params
    const { expensesId, truckId } = useParams();

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
    //function to get and compute yearly costs and trips
    const computeYearlyTotalTripsAndFuelCosts = async () => {
        try {
            console.log(truckId)
            const response = await axios.get(`http://localhost:2222/monthly/expenses/${truckId}/${year}`);
            const trips = response.data.length;
            let totalFuelCosts = 0;
            for (let i = 0; i < trips; i++) {
                totalFuelCosts += response.data[i].dieselConsumption;
            }
            let totalMaintenance = 0;
            for (let i = 0; i < trips; i++) {
                totalMaintenance += response.data[i].maintenance;
            }
            setMaintenanceCosts(totalMaintenance);
            setTotalTrips(trips);
            setTotalDieselConsumption(totalFuelCosts);
            setTotalExpenses(totalFuelCosts + totalMaintenance + parseInt(ltoFees) + parseInt(fcieFees) + parseInt(miscStickerFees))
            console.log(totalExpenses)
        } catch (error) {
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    }

    //function to create an expense - update this to include the new fields
    const handleCreateExpense = async () => {
        console.log(expensesId);
        //checks if selected type is yearly
        if (selectedType === "option1") {
            try {
                const data = {
                    truck: truckId,
                    year,
                    ltoReg: ltoFees,
                    fcieReg: fcieFees,
                    stickerReg: miscStickerFees,
                    maintenance: maintenanceCosts,
                    totalTrips,
                    totalDieselConsumption,
                    totalExpenses
                };
                setLoading(true);
                const response = await axios.post('http://localhost:2222/yearlyexpenses', data);
                const newObjectID = response.data._id;
                const getObject = await axios.get(`http://localhost:2222/expenses/${expensesId}`);
                getObject.data.yearlyExpenses.push(newObjectID);
                await axios.put(`http://localhost:2222/expenses/${expensesId}`, getObject.data);
                setLoading(false);
                alert("Expense Created");
                window.history.back();
            } catch (error) {
                setLoading(false);
                alert("Error occurred. Please check console.");
                console.error(error);
            }
        }
        //checks if selected type is monthly
        else if (selectedType === "option2") {
            try {
                const data = {
                    truck: truckId, month, maintenance: monthlyMaintenanceCosts, dieselConsumption: dieselCosts, totalTrips: trips, year
                };
                setLoading(true);
                const response = await axios.post('http://localhost:2222/monthlyexpenses', data);
                const newObjectID = response.data._id;
                const getObject = await axios.get(`http://localhost:2222/expenses/${expensesId}`);
                getObject.data.monthlyExpenses.push(newObjectID);
                await axios.put(`http://localhost:2222/expenses/${expensesId}`, getObject.data);
                setLoading(false);
                alert("Expense created.");
                window.history.back();
            } catch (error) {
                setLoading(false);
                alert("Error occurred. Please check console.");
                console.error(error);
            }
        }
    };

    let formFields = null;

    if (selectedType === "option1") {
        formFields = (
            <div>
                <label>Year</label>
                <input
                    type="String"
                    className="form-control"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                />
                <label>LTO Fees</label>
                <input
                    type="number"
                    className="form-control"
                    required
                    value={ltoFees}
                    onChange={(e) => setLtoFees(e.target.value)}
                />
                <label>FCIE Fees</label>
                <input
                    type="number"
                    className="form-control"
                    required
                    value={fcieFees}
                    onChange={(e) => setFcieFees(e.target.value)}
                />
                <label>Misc. Sticker Fees</label>
                <input
                    type="number"
                    className="form-control"
                    required
                    value={miscStickerFees}
                    onChange={(e) => setMiscStickerFees(e.target.value)}
                />
                <label>Maintenance Costs</label>
                <input
                    type="number"
                    className="form-control"
                    required
                    value={maintenanceCosts}
                    disabled
                />
                <label>Total Trips</label>
                <input
                    type="number"
                    className="form-control"
                    required
                    value={totalTrips}
                    disabled
                />
                <label>Total Diesel Consumption</label>
                <input
                    type="number"
                    className="form-control"
                    required
                    value={totalDieselConsumption}
                    disabled
                />
                <label>Total Expenses</label>
                <input
                    type="number"
                    className="form-control"
                    required
                    value={totalExpenses}
                    disabled
                />
                <div className="row">
                    <div className="col">
                        <button className="btn btn-success mx-auto d-flex mt-4 mb-4" onClick={computeYearlyTotalTripsAndFuelCosts}>Calculate</button>
                    </div>
                    <div className="col">
                        <button className="btn btn-success mx-auto d-flex mt-4 mb-4" onClick={handleCreateExpense}>Create</button>
                    </div>
                </div>
            </div>
        );
    } else if (selectedType === "option2") {
        formFields = (
            <div>
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
                <label>Total Trips:</label>
                <input
                    type="number"
                    className="form-control"
                    required
                    value={trips}
                    onChange={(e) => setTrips(e.target.value)}
                    disabled
                />
                <label>Total Fuel Cost:</label>
                <input
                    type="number"
                    className="form-control"
                    required
                    value={dieselCosts}
                    onChange={(e) => setDieselCosts(e.target.value)}
                    disabled
                />
                <div className="row">
                    <div className="col">
                        <button className="btn btn-success mx-auto d-flex mt-4 mb-4" onClick={computeMonthlyTotalTripsAndFuelCosts}>Calculate</button>
                    </div>
                    <div className="col">
                        <button className="btn btn-success mx-auto d-flex mt-4 mb-4" onClick={handleCreateExpense}>Create</button>
                    </div>
                </div>
            </div>

        );
    }

    return (
        <div className="row">
            <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
                <h5>Create New Expense</h5>
                <label>Type of Expense</label>
                <select
                    className="form-select"
                    required
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option value="option1">Yearly Expense</option>
                    <option value="option2">Monthly Expense</option>
                </select>

                {formFields}

            </div>
        </div >
    );
};

export default CreateExpense;