//dependencies
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

//create truck form
export const CreateTruck = () => {
    const [newTruck, setNewTruck] = useState({}) //state for new truck object
    const [plateNumber, setPlateNumber] = useState('')
    const [truckType, setTruckType] = useState('')
    const [expenses, setExpenses] = useState({
        yearlyExpenses: [],
        monthlyExpenses: []
    })
    const navigate = useNavigate();

    //function to create a new truck
    const handleCreateTruck = async () => {
        try {
            const data = {
                plateNumber,
                truckType,
            };
            const response = await axios.post('http://localhost:2222/trucks', data) //create new truck - no expenses yet
            const expenseResponse = await axios.post('http://localhost:2222/expenses', expenses) //create new expenses associated with truck
            const newObjectID = response.data._id; //get truck ID for getting truck object
            const getObject = await axios.get(`http://localhost:2222/trucks/${newObjectID}`);
            setNewTruck(getObject.data); //set new truck object
            newTruck.expenses = expenseResponse.data._id; //set new truck expenses
            await axios.put(`http://localhost:2222/trucks/${newObjectID}`, newTruck); //update truck with expenses
            console.log(response.data);
            alert("Truck created.");
            navigate(`/trucks`); //navigate to truck details page
        } catch (error) {
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    };
    return (

        <div className="row">
            <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
                <h5>Create New Truck</h5>
                <label>Plate Number </label>
                <input type="text" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} className="form-control"></input>
                <label>Truck Type </label>
                <input type="text" value={truckType} onChange={(e) => setTruckType(e.target.value)} className="form-control"></input>
                <button className="btn btn-success mx-auto d-flex mt-4 mb-4" onClick={handleCreateTruck}>Create</button>
            </div>
        </div>
    )
}

//create trip form
//comments: use form, use prevent default to prevent it from reloading
export const CreateTrip = () => {
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState("option1");

    //states for trip details
    const [driver, setDriver] = useState({
        name: "John Doe",
    });
    const [customer, setCustomer] = useState({
        name: "John Doe",
        location: "default location"
    });
    const [helper, setHelper] = useState({
        name: "John Doe",
    });

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


    //navigattion after creation
    const navigate = useNavigate();
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
                truck: truckId,
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
            window.history.back();
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
                <select class="form-select" value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option selected>Select month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>

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

//create expense form
export const CreateExpense = () => {
    const [loading, setLoading] = useState(false); //loading is not used here
    const [selectedType, setSelectedType] = useState("option1");

    //states for yearly expenses
    const [year, setYear] = useState("");
    const [ltoFees, setLtoFees] = useState("0");
    const [fcieFees, setFcieFees] = useState("0");
    const [miscStickerFees, setMiscStickerFees] = useState("0");
    const [maintenanceCosts, setMaintenanceCosts] = useState(0);
    const [totalDieselConsumption, setTotalDieselConsumption] = useState("");
    const [totalExpenses, setTotalExpenses] = useState("0");
    const [totalTrips, setTotalTrips] = useState("");
    //states for monthly expenses
    const [month, setMonth] = useState("");
    const [trips, setTrips] = useState("");
    const [monthlyMaintenanceCosts, setMonthlyMaintenanceCosts] = useState(0);
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
            let totalYearlyTrips = 0;
            console.log(response.data[0].totalTrips)
            console.log(response.data[0].maintenance)
            console.log(response.data[0].dieselConsumption)
            for (let i = 0; i < response.data.length; i++) {
                totalYearlyTrips += parseFloat(response.data[i].totalTrips);
            }
            let totalFuelCosts = 0;
            for (let i = 0; i < response.data.length; i++) {
                totalFuelCosts += parseFloat(response.data[i].dieselConsumption);
            }
            console.log("Total fuel costs:" + totalFuelCosts)
            let totalMaintenance = 0;
            for (let i = 0; i < response.data.length; i++) {
                totalMaintenance += parseFloat(response.data[i].maintenance);
            }
            console.log("Total maintenance: " + totalMaintenance)
            setMaintenanceCosts(totalMaintenance);
            setTotalTrips(totalYearlyTrips);
            setTotalDieselConsumption(totalFuelCosts);
            setTotalExpenses(totalFuelCosts + totalMaintenance + parseInt(ltoFees) + parseInt(fcieFees) + parseInt(miscStickerFees))
            console.log("Total expenses:" + totalExpenses)
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
                alert("Record created.");
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
                <select class="form-select" value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option selected>Select month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>
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

//edit truck form
export const EditTruck = () => {
    const [newTruck, setNewTruck] = useState({}) //state for new truck object
    const [plateNumber, setPlateNumber] = useState('')
    const [truckType, setTruckType] = useState('')
    const { id } = useParams();

    //get truck ID from url then set states
    useEffect(() => {
        const getTruck = async () => {
            try {
                const response = await axios.get(`http://localhost:2222/trucks/${id}`);
                setNewTruck(response.data);
                setPlateNumber(response.data.plateNumber);
                setTruckType(response.data.truckType);
            } catch (error) {
                console.error(error);
            }
        };
        getTruck();
    }, [])

    //function to create a new truck
    const handleUpdateTruck = async () => {
        try {
            const data = {
                plateNumber,
                truckType,
            };
            const response = await axios.put(`http://localhost:2222/trucks/${id}`, data) //update truck
            console.log(response.data);
        } catch (error) {
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    };

    return (
        <div className="row">
            <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
                <h5>Edit Truck</h5>
                <label>Plate Number </label>
                <input type="text" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} className="form-control"></input>
                <label>Truck Type </label>
                <input type="text" value={truckType} onChange={(e) => setTruckType(e.target.value)} className="form-control"></input>
                <button className="btn btn-success mx-auto d-flex mt-4 mb-4" onClick={handleUpdateTruck}>Edit</button>
            </div>
        </div>
    )
}

//edit monthly expenses
export const EditMonthlyExpense = () => {
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
                <select class="form-select" value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option selected>Select month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>
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

//edit yearly expenses
export const EditYearlyExpense = () => {
    //states for yearly expenses
    const [year, setYear] = useState("");
    const [ltoFees, setLtoFees] = useState("0");
    const [fcieFees, setFcieFees] = useState("0");
    const [miscStickerFees, setMiscStickerFees] = useState("0");
    const [maintenanceCosts, setMaintenanceCosts] = useState("0");
    const [totalDieselConsumption, setTotalDieselConsumption] = useState("");
    const [totalExpenses, setTotalExpenses] = useState("0");
    const [totalTrips, setTotalTrips] = useState("");
    //get object id from url
    const { id, truckId } = useParams();

    //function to get yearly expense
    useEffect(() => {
        const getYearlyExpense = async () => {
            try {
                const response = await axios.get(`http://localhost:2222/yearlyexpenses/${id}`);
                console.log(response);
                setYear(response.data.year);
                setLtoFees(response.data.ltoReg);
                setFcieFees(response.data.fcieReg);
                setMiscStickerFees(response.data.stickerReg);
                setMaintenanceCosts(response.data.maintenance);
            } catch (error) {
                alert("Error occurred. Please check console.");
                console.error(error);
            }
        };
        getYearlyExpense();
    }, [id]);

    //function to get and compute yearly costs and trips
    const computeYearlyTotalTripsAndFuelCosts = async () => {
        try {
            console.log(truckId)
            const response = await axios.get(`http://localhost:2222/monthly/expenses/${truckId}/${year}`);
            let totalYearlyTrips = 0;
            console.log(response.data[0].totalTrips)
            console.log(response.data[0].maintenance)
            console.log(response.data[0].dieselConsumption)
            for (let i = 0; i < response.data.length; i++) {
                totalYearlyTrips += parseFloat(response.data[i].totalTrips);
            }
            let totalFuelCosts = 0;
            for (let i = 0; i < response.data.length; i++) {
                totalFuelCosts += response.data[i].dieselConsumption;
            }
            let totalMaintenance = 0;
            for (let i = 0; i < response.data.length; i++) {
                totalMaintenance += response.data[i].maintenance;
            }
            setMaintenanceCosts(totalMaintenance);
            setTotalTrips(totalYearlyTrips);
            setTotalDieselConsumption(totalFuelCosts);
            setTotalExpenses(totalFuelCosts + totalMaintenance + parseInt(ltoFees) + parseInt(fcieFees) + parseInt(miscStickerFees))
            console.log(totalExpenses)
        } catch (error) {
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    }


    //function to update yearly expense
    const handleUpdateExpense = async () => {
        try {
            const data = {
                year,
                ltoReg: ltoFees,
                fcieReg: fcieFees,
                stickerReg: miscStickerFees,
                maintenance: maintenanceCosts,
                totalTrips,
                totalDieselConsumption,
                totalExpenses
            };
            const response = await axios.put(`http://localhost:2222/yearlyexpenses/${id}`, data);
            console.log(response);
            console.log(response.data)
            alert("Yearly Expense updated.");
            window.history.back();
        } catch (error) {
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    };

    return (
        <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
            <h4>Update Yearly Expense</h4>
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
                    <button className="btn btn-success mx-auto d-flex mt-4 mb-4" onClick={handleUpdateExpense}>Update</button>
                </div>
            </div>
        </div >
    )
}

//edit trip
export const EditTrip = () => {
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