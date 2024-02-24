//dependencies
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SnackbarProvider, enqueueSnackbar, useSnackbar } from "notistack";
import axios from "axios";
//import components
import { BackButton } from "./Widgets";

//MOSTLY NOTIFICATIONS AND PROPER ERROR MESSAGES

//register a new user
export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [PARTY, setPARTY] = useState("Admin");
  const [passwordFilledUp, setPasswordFilledUp] = useState(false);
  const [error, setError] = useState("");
  //
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  //function to register a new user
  const handleRegister = async () => {
    event.preventDefault();
    setLoading(true);
    if (password !== confirmation) {
      setLoading(false);
      setError("Passwords do not match.");
      enqueueSnackbar("Passwords do not match.", { variant: "error" });
      return;
    } else {
      try {
        const data = {
          username,
          password,
          role: PARTY,
        };
        const response = await axios.post(
          "http://localhost:2222/register",
          data
        );
        console.log(response.data);
        setLoading(false);
        enqueueSnackbar("User created.", { variant: "success" });
        navigate("/");
      } catch (error) {
        setLoading(false);
        enqueueSnackbar("Error occurred.", { variant: "error" });
        setError(error.message);
      }
    }
  };

  //handling password validation
  const handlePasswordFilledUp = (e) => {
    setPasswordFilledUp(true);
    setPassword(e.target.value);
  };

  const areFormsFilled = () => {
    if (username && password && confirmation) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div
      id="loginBackground"
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <form
        id="registrationPanel"
        className="form-control"
        onSubmit={handleRegister}
      >
        <div className="row">
          <h3 className="logo">Registration</h3>
        </div>
        <div className="row">
          <label className="mb-1 mt-1">Username</label>
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="row">
          <label className="mb-1 mt-1">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={handlePasswordFilledUp}
          />
        </div>
        <div className="row">
          <label className="mb-1 mt-1">Role</label>
          <select
            className="form-select"
            value={PARTY}
            onChange={(e) => setPARTY(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        {passwordFilledUp ? ( //if password is filled up, show confirmation field
          <div className="row">
            <label className="mb-1 mt-1">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </div>
        ) : null}
        {error ? ( //if error is not null, show error message}
          <div>
            <p className="text-danger">{error}</p>
          </div>
        ) : null}
        <div className="row">
          <button
            className="btn btn-success mx-auto mt-4 ${areFormsFilled() ? '' : 'disabled'}`"
            type="submit"
            disabled={!areFormsFilled()}
          >
            Register
          </button>
        </div>
        <div className="text-center mt-1">
          <Link to={"/"} className="text-muted text-decoration-none fw-light">
            Already registered?
          </Link>
        </div>
      </form>
    </div>
  );
};

//create truck form - THIS LOOKS UGLY
export const CreateTruck = () => {
  const navigate = useNavigate();
  const [newTruck, setNewTruck] = useState({}); //state for new truck object
  const [plateNumber, setPlateNumber] = useState("");
  const [truckType, setTruckType] = useState("");
  const [underMaintenance, setUnderMaintenance] = useState(false); //default value for underMaintenance is false
  const [expenses, setExpenses] = useState({
    //create an empty expense object
    yearlyExpenses: [],
    monthlyExpenses: [],
  });

  //function to create a new truck
  const handleCreateTruck = async () => {
    try {
      const data = {
        plateNumber,
        truckType,
        underMaintenance,
        expenses: expenses,
      };
      const response = await axios.post("http://localhost:2222/trucks", data); //create new truck
      enqueueSnackbar("Truck created.", { variant: "success" });
      navigate(`/trucks`); //navigate to truck details page
    } catch (error) {
      enqueueSnackbar("Process failed.", { variant: "error" });
      console.error(error);
    }
  };

  return (
    <div className="row">
      <div className="p-4 mx-auto mt-4" style={{ width: "50%" }}>
        <h5>Create New Truck</h5>
        <label>Plate Number </label>
        <input
          type="text"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          className="form-control"
        ></input>
        <label>Truck Type </label>
        <input
          type="text"
          value={truckType}
          onChange={(e) => setTruckType(e.target.value)}
          className="form-control"
        ></input>
        <button
          className="btn btn-success mx-auto d-flex mt-4 mb-4"
          onClick={handleCreateTruck}
        >
          Create
        </button>
      </div>
    </div>
  );
};

//create trip form
export const CreateTrip = () => {
  const [loading, setLoading] = useState(false);

  //states for trip details
  const [driver, setDriver] = useState({
    name: "",
  });
  const [customer, setCustomer] = useState({
    name: "",
    location: "",
  });
  const [helper, setHelper] = useState({
    name: "",
  });

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [timeDispatched, setTimeDispatched] = useState("");
  const [timeReceived, setTimeReceived] = useState("");
  const [timeReturned, setTimeReturned] = useState("");
  const [status, setStatus] = useState("Pending");
  const [distance, setDistance] = useState("");
  const [dieselCost, setDieselCost] = useState("60");
  const [dieselConsumption, setDieselConsumption] = useState("");
  const [tollFee, setTollFee] = useState(0);
  const [pathway, setPathway] = useState(0);
  const [totalTripCost, setTotalTripCost] = useState("");
  //truck type
  const [truckType, setTruckType] = useState(""); //truck type [forward, elf

  //navigation after creation
  const navigate = useNavigate();
  //get truck ID from URL params
  const { truckId } = useParams();

  useEffect(() => {
    const getTruck = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2222/trucks/${truckId}`
        );
        setTruckType(response.data.truckType);
      } catch (error) {
        console.error(error);
      }
    };
    getTruck();
    console.log(truckType);
  }, []);

  //functions to automatically compute diesel consumption and total trip cost
  function handleDistanceChange(event) {
    const newDistance = event.target.value;
    const newDieselConsumption = calculateDieselConsumption(
      newDistance,
      dieselCost
    );
    const newTotalTripCost = calculateTotalTripCost(
      newDieselConsumption,
      tollFee,
      pathway
    );
    setDistance(newDistance);
    setDieselConsumption(newDieselConsumption);
    setTotalTripCost(newTotalTripCost);
  }

  function handleDieselCostChange(event) {
    const newDieselCost = event.target.value;
    const newDieselConsumption = calculateDieselConsumption(
      distance,
      newDieselCost
    );
    const newTotalTripCost = calculateTotalTripCost(
      newDieselConsumption,
      tollFee,
      pathway
    );
    setDieselCost(newDieselCost);
    setDieselConsumption(newDieselConsumption);
    setTotalTripCost(newTotalTripCost);
  }

  function handleTollFeeChange(event) {
    const newTollFee = event.target.value;
    const newTotalTripCost = calculateTotalTripCost(
      dieselConsumption,
      newTollFee,
      pathway
    );
    setTollFee(newTollFee);
    setTotalTripCost(newTotalTripCost);
  }

  function handlePathwayChange(event) {
    const newPathway = event.target.value;
    const newTotalTripCost = calculateTotalTripCost(
      dieselConsumption,
      tollFee,
      newPathway
    );
    setPathway(newPathway);
    setTotalTripCost(newTotalTripCost);
  }

  function calculateDieselConsumption(distance, dieselCost) {
    if (truckType === "Forward") {
      const fuelConsumption = distance / 6; //if forward, divide by six, if elf, divide by 7
      const totalFuelCost = fuelConsumption * dieselCost;
      return totalFuelCost.toFixed(2);
    } else if (truckType === "Elf") {
      const fuelConsumption = distance / 7;
      const totalFuelCost = fuelConsumption * dieselCost;
      return totalFuelCost.toFixed(2);
    } else {
      const fuelConsumption = distance / 3;
      const totalFuelCost = fuelConsumption * dieselCost;
      return totalFuelCost.toFixed(2);
    }
  }

  function calculateTotalTripCost(dieselConsumption, tollFee, pathway) {
    if (!pathway) {
      const totalTripCost = parseFloat(dieselConsumption) + parseFloat(tollFee);
      return totalTripCost.toFixed(2);
    } else if (!tollFee) {
      const totalTripCost = parseFloat(dieselConsumption) + parseFloat(pathway);
      return totalTripCost.toFixed(2);
    } else {
      const totalTripCost =
        parseFloat(dieselConsumption) +
        parseFloat(tollFee) +
        parseFloat(pathway);
      return totalTripCost.toFixed(2);
    }
  }

  async function postTrip() {
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
        status: status,
        distance,
        dieselCost,
        dieselConsumption,
        tollFee,
        pathway,
        totalTripExpense: totalTripCost,
      };
      const response = await axios.post("http://localhost:2222/trips", data);
      return response.data._id;
    } catch (error) {
      console.error(error);
    }
  }

  async function updateTruckObject(truckId, newObjectID) {
    try {
      const getObject = await axios.get(
        `http://localhost:2222/trucks/${truckId}`
      );
      getObject.data.trips.push(newObjectID);
      await axios.put(
        `http://localhost:2222/trucks/${truckId}`,
        getObject.data
      );
    } catch (error) {
      console.error(error);
    }
  }

  //function to create an expense
  const handleCreateTrip = async () => {
    event.preventDefault();
    setLoading(true);
    try {
      updateTruckObject(truckId, await postTrip());
      setLoading(false);
      enqueueSnackbar("Trip created.", { variant: "success" });
      navigate(`/trucks/details/${truckId}`); //navigate to truck details page
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Process failed.", { variant: "error" });
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="infoContainer p-4" style={{ minHeight: "100vh" }}>
        <form>
          <div className="row">
            <div className="col">
              <h3>
                <span className="logo">Create</span> New Trip
              </h3>
            </div>
            <div className="col text-end">
              <BackButton />
            </div>
          </div>

          <div className="row">
            <div className="col p-4">
              <div className="row">
                <h6>Trip Details</h6>
              </div>
              <div className="row">
                <label>Driver Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="driverName"
                  value={driver.name}
                  onChange={(e) =>
                    setDriver({ ...driver, name: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <label>Helper Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="helperName"
                  value={helper.name}
                  onChange={(e) =>
                    setHelper({ ...helper, name: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <label>Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="customerName"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <label>Customer Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="customerLocation"
                  value={customer.location}
                  onChange={(e) =>
                    setCustomer({ ...customer, location: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <label>Year</label>
                <input
                  type="string"
                  className="form-control"
                  name="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>
              <div className="row">
                <label>Month</label>
                <select
                  class="form-select"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
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
              </div>
              <div className="row">
                <label>Day</label>
                <input
                  type="string"
                  className="form-control"
                  name="day"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="col p-4">
              <div className="row">
                <h6>Trip Status</h6>
              </div>
              <div className="row">
                <label>Time Dispatched</label>
                <input
                  type="time"
                  className="form-control"
                  name="timeDispatched"
                  value={timeDispatched}
                  onChange={(e) => setTimeDispatched(e.target.value)}
                  required
                />
              </div>
              <div className="row">
                <label>Time Received</label>
                <input
                  type="time"
                  className="form-control"
                  name="timeReceived"
                  value={timeReceived}
                  onChange={(e) => setTimeReceived(e.target.value)}
                />
              </div>

              <div className="row">
                <label>Time Returned</label>
                <input
                  type="time"
                  className="form-control"
                  name="timeReturned"
                  value={timeReturned}
                  onChange={(e) => setTimeReturned(e.target.value)}
                />
              </div>
              <div className="row">
                <label>Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value={"Pending"}>Pending</option>
                  <option value={"Done"}>Done</option>
                </select>
              </div>
              <div className="row">
                <label>Distance (KM)</label>
                <input
                  type="text"
                  className="form-control"
                  name="distance"
                  value={distance}
                  onChange={handleDistanceChange}
                />
              </div>
            </div>
            <div className="col p-4">
              <div className="row">
                <h6>Trip Costs</h6>
              </div>
              <div className="row">
                <label>Diesel Price (/liter)</label>
                <input
                  type="text"
                  className="form-control"
                  name="dieselCost"
                  value={dieselCost}
                  onChange={handleDieselCostChange}
                />
              </div>

              <div className="row">
                <label>Toll Fees</label>
                <input
                  type="text"
                  className="form-control"
                  name="tollFee"
                  value={tollFee}
                  onChange={handleTollFeeChange}
                />
              </div>

              <div className="row">
                <label>Pathway Fees</label>
                <input
                  type="number"
                  className="form-control"
                  name="pathway"
                  value={pathway}
                  onChange={handlePathwayChange}
                />
              </div>
              <div className="row">
                <label>Total Fuel Cost</label>
                <input
                  type="text"
                  className="form-control"
                  name="dieselConsumption"
                  value={dieselConsumption}
                  readOnly
                  disabled
                />
              </div>
              <div className="row">
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
              </div>
            </div>
          </div>
          <div className="p-4 mx-auto mt-4" style={{ width: "50%" }}>
            <button
              className="btn btn-success mt-4 mx-auto d-flex"
              onClick={handleCreateTrip}
            >
              Create
            </button>
          </div>
        </form>
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
  const [monthlyTotalCosts, setMonthlyTotalCosts] = useState(0);

  // set the expense ID state to the ID from the URL params
  const { truckId } = useParams();

  //function to get and compute total trips and total fuel costs
  const computeMonthlyTotalTripsAndFuelCosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2222/trips/${truckId}/${year}/${month}`
      );
      const trips = response.data.length;
      if (trips === 0) {
        enqueueSnackbar("No data found.", { variant: "error" });
        setLoading(false);
        setTrips(0);
        setDieselCosts(0);
        setMonthlyTotalCosts(0);
        return;
      }
      let totalFuelCosts = 0;
      for (let i = 0; i < trips; i++) {
        totalFuelCosts += response.data[i].dieselConsumption;
      }
      let monthlyTotalCosts = 0;
      monthlyTotalCosts =
        parseFloat(totalFuelCosts) + parseFloat(monthlyMaintenanceCosts);
      setTrips(trips);
      setDieselCosts(totalFuelCosts);
      setMonthlyTotalCosts(monthlyTotalCosts);
      enqueueSnackbar("Calculation successful.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Process failed.", { variant: error });
      console.error(error);
    }
  };
  //function to get and compute yearly costs and trips
  const computeYearlyTotalTripsAndFuelCosts = async () => {
    try {
      console.log(truckId);
      const response = await axios.get(
        `http://localhost:2222/expenses/yearly/${truckId}/${year}`
      );
      if (response.data.length === 0) {
        enqueueSnackbar("No data found.", { variant: "error" });
        return;
      }
      let totalYearlyTrips = 0;
      for (let i = 0; i < response.data.length; i++) {
        totalYearlyTrips += parseFloat(response.data[i].totalTrips);
      }
      let totalFuelCosts = 0;
      for (let i = 0; i < response.data.length; i++) {
        totalFuelCosts += parseFloat(response.data[i].dieselConsumption);
      }
      console.log("Total fuel costs:" + totalFuelCosts);
      let totalMaintenance = 0;
      for (let i = 0; i < response.data.length; i++) {
        totalMaintenance += parseFloat(response.data[i].maintenance);
      }
      console.log("Total maintenance: " + totalMaintenance);
      setMaintenanceCosts(totalMaintenance);
      setTotalTrips(totalYearlyTrips);
      setTotalDieselConsumption(totalFuelCosts);
      setTotalExpenses(
        totalFuelCosts +
          totalMaintenance +
          parseInt(ltoFees) +
          parseInt(fcieFees) +
          parseInt(miscStickerFees)
      );
      console.log("Total expenses:" + totalExpenses);
      enqueueSnackbar("Calculation successful.", { variant: "success" });
    } catch (error) {
      alert("Error occurred. Please check console.");
      console.error(error);
    }
  };

  //function to create an expense
  const handleCreateExpense = async () => {
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
          totalExpenses,
        };
        setLoading(true);
        const response = await axios.post(
          "http://localhost:2222/expenses/yearly",
          data
        ); //create a new yearly expense
        const newObjectID = response.data._id; //get yearly expense ID
        const truckData = await axios.get(
          `http://localhost:2222/trucks/${truckId}`
        ); //get the truck data
        truckData.data.expenses.yearlyExpenses.push(newObjectID); //push the yearly expense ID to the truck data
        await axios.put(
          `http://localhost:2222/trucks/${truckId}`,
          truckData.data
        ); //update the truck data
        setLoading(false);
        enqueueSnackbar("Yearly expense created.", { variant: "success" });
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
          truck: truckId,
          month,
          maintenance: monthlyMaintenanceCosts,
          dieselConsumption: dieselCosts,
          totalTrips: trips,
          year,
          totalMonthlyExpenses: monthlyTotalCosts,
        };
        setLoading(true);
        const response = await axios.post(
          "http://localhost:2222/expenses/monthly",
          data
        ); //create a new monthly expense
        const newObjectID = response.data._id; //get monthly expense ID
        const truckData = await axios.get(
          `http://localhost:2222/trucks/${truckId}`
        ); //get the truck data
        truckData.data.expenses.monthlyExpenses.push(newObjectID); //push the monthly expense ID to the truck data
        await axios.put(
          `http://localhost:2222/trucks/${truckId}`,
          truckData.data
        ); //update the truck data
        setLoading(false);
        enqueueSnackbar("Monthly expense created.", { variant: "success" });
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
            <button
              className="btn btn-success mx-auto d-flex mt-4 mb-4"
              onClick={computeYearlyTotalTripsAndFuelCosts}
            >
              Calculate
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-success mx-auto d-flex mt-4 mb-4"
              onClick={handleCreateExpense}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    );
  } else if (selectedType === "option2") {
    formFields = (
      <div>
        <label>Month</label>
        <select
          class="form-select"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
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
        <label>Total Monthly Cost:</label>
        <input
          type="number"
          className="form-control"
          required
          value={monthlyTotalCosts}
          onChange={(e) => setMonthlyTotalCosts(e.target.value)}
          disabled
        />
        <div className="row">
          <div className="col">
            <button
              className="btn btn-success mx-auto d-flex mt-4 mb-4"
              onClick={computeMonthlyTotalTripsAndFuelCosts}
            >
              Calculate
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-success mx-auto d-flex mt-4 mb-4"
              onClick={handleCreateExpense}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div
        className="p-4 mx-auto mt-3 infoContainer rounded"
        style={{ width: "40%", maxHeight: "95vh" }}
      >
        <div className="row">
          <div className="col-10">
            <h3 className="logo">Create New Expense</h3>
          </div>
          <div className="col text-end">
            <BackButton />
          </div>
        </div>

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
    </div>
  );
};

//edit truck form -- THIS LOOKS UGLY
export const EditTruck = () => {
  const [newTruck, setNewTruck] = useState({}); //state for new truck object
  const [plateNumber, setPlateNumber] = useState("");
  const [truckType, setTruckType] = useState("");
  const [underMaintenance, setUnderMaintenance] = useState(false); //default value for underMaintenance is false
  //get truck ID from URL params
  const { id } = useParams();
  const navigate = useNavigate();

  async function getTruck() {
    try {
      const response = await axios.get(`http://localhost:2222/trucks/${id}`);
      setNewTruck(response.data);
      setPlateNumber(response.data.plateNumber);
      setUnderMaintenance(response.data.underMaintenance);
      setTruckType(response.data.truckType);
    } catch (error) {
      console.error(error);
    }
  }

  //function to create a new truck
  const handleUpdateTruck = async () => {
    event.preventDefault();
    try {
      const data = {
        plateNumber,
        truckType,
        underMaintenance,
      };
      const response = await axios.put(
        `http://localhost:2222/trucks/${id}`,
        data
      ); //update truck
      console.log(response.data);
      enqueueSnackbar("Truck updated.", { variant: "success" });
      navigate(`/trucks`);
    } catch (error) {
      alert("Error occurred. Please check console.");
      console.error(error);
    }
  };

  useEffect(() => {
    getTruck();
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <form id="editTruckForm" className="p-4 mx-auto border-0 rounded">
        <div className="row">
          <div className="col-11">
            <h5>Edit Truck</h5>
          </div>
          <div className="col">
            <BackButton />
          </div>
        </div>
        <div className="row mb-2">
          <label className="mb-1">Plate Number </label>
          <input
            type="text"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            className="form-control"
          ></input>
        </div>
        <div className="row mb-2">
          <label className="mb-1">Truck Type </label>
          <input
            type="text"
            value={truckType}
            onChange={(e) => setTruckType(e.target.value)}
            className="form-control"
          ></input>
        </div>
        <div className="row mb-2">
          <label className="mb-1">Maintenance Status</label>
          <select
            className="form-select"
            value={underMaintenance}
            onChange={(e) => setUnderMaintenance(e.target.value)}
          >
            <option value="true">Under Maintenance</option>
            <option value="false">Not Under Maintenance</option>
          </select>
        </div>
        <button
          className="btn btn-success mx-auto d-flex mt-4 mb-4"
          onClick={handleUpdateTruck}
        >
          Edit
        </button>
      </form>
    </div>
  );
};

//edit monthly expenses
export const EditMonthlyExpense = () => {
  //states for monthly expenses
  const [truckId, setTruckId] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [trips, setTrips] = useState("");
  const [monthlyMaintenanceCosts, setMonthlyMaintenanceCosts] = useState("0");
  const [dieselCosts, setDieselCosts] = useState("");
  const [monthlyTotalCosts, setMonthlyTotalCosts] = useState("0");
  //get object id from url
  const { id } = useParams();

  //function to get monthly expense
  useEffect(() => {
    const getMonthlyExpense = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2222/expenses/monthly/${id}`
        );
        console.log(response);
        setTruckId(response.data.truck);
        setMonth(response.data.month);
        setYear(response.data.year);
        setMonthlyMaintenanceCosts(response.data.maintenance);
        setDieselCosts(response.data.dieselConsumption);
        setTrips(response.data.totalTrips);
        setMonthlyTotalCosts(response.data.totalMonthlyExpenses);
        enqueueSnackbar("Monthly expense retrieved.", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("Error occurred. Please check console.", {
          variant: "error",
        });
        console.error(error);
      }
    };
    getMonthlyExpense();
  }, [id]);

  //function to get and compute total trips and total fuel costs
  const computeMonthlyTotalTripsAndFuelCosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2222/trips/${truckId}/${year}/${month}`
      );
      const trips = response.data.length;
      console.log(trips);
      let totalFuelCosts = 0;
      for (let i = 0; i < trips; i++) {
        totalFuelCosts += response.data[i].dieselConsumption;
      }
      let monthlyTotalCosts = 0;
      monthlyTotalCosts =
        parseFloat(totalFuelCosts) + parseFloat(monthlyMaintenanceCosts);
      setTrips(trips);
      setDieselCosts(totalFuelCosts);
      setMonthlyTotalCosts(monthlyTotalCosts);
      enqueueSnackbar("Calculation successful.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Process failed.", { variant: "error" });
      console.error(error);
    }
  };

  //function to update monthly expense
  const handleUpdateExpense = async () => {
    try {
      const data = {
        month,
        maintenance: monthlyMaintenanceCosts,
        dieselConsumption: dieselCosts,
        totalTrips: trips,
        year,
        totalMonthlyExpenses: monthlyTotalCosts,
      };
      const response = await axios.put(
        `http://localhost:2222/expenses/monthly/${id}`,
        data
      );
      console.log(response.data);
      enqueueSnackbar("Monthly expense updated.", { variant: "success" });
      window.history.back();
    } catch (error) {
      enqueueSnackbar("Process failed.", { variant: "error" });
      console.error(error);
    }
  };

  return (
    <div className="row">
      <div
        className="p-4 mx-auto mt-3 infoContainer rounded"
        style={{ width: "40%", maxHeight: "95vh" }}
      >
        <div className="row">
          <div className="col-10">
            <h3>
              <span className="logo">Update</span> Monthly Expense
            </h3>
          </div>
          <div className="col text-end">
            <BackButton />
          </div>
        </div>

        <label>Month</label>
        <select
          class="form-select"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
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
        <label>Total Monthly Cost:</label>
        <input
          type="number"
          className="form-control"
          required
          value={monthlyTotalCosts}
          onChange={(e) => setMonthlyTotalCosts(e.target.value)}
          disabled
        />
        <div className="row">
          <div className="col">
            <button
              className="btn btn-success mx-auto d-flex mt-4 mb-4"
              onClick={computeMonthlyTotalTripsAndFuelCosts}
            >
              Calculate
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-success mx-auto d-flex mt-4 mb-4"
              onClick={handleUpdateExpense}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

//edit yearly expenses
export const EditYearlyExpense = () => {
  //states for yearly expenses
  const [truckId, setTruckId] = useState("");
  const [year, setYear] = useState("");
  const [ltoFees, setLtoFees] = useState("0");
  const [fcieFees, setFcieFees] = useState("0");
  const [miscStickerFees, setMiscStickerFees] = useState("0");
  const [maintenanceCosts, setMaintenanceCosts] = useState("0");
  const [totalDieselConsumption, setTotalDieselConsumption] = useState("");
  const [totalExpenses, setTotalExpenses] = useState("0");
  const [totalTrips, setTotalTrips] = useState("");
  //get object id from url
  const { id } = useParams();

  const getYearlyExpense = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2222/expenses/yearly/${id}`
      );
      console.log(response);
      setTruckId(response.data.truck);
      setYear(response.data.year);
      setLtoFees(response.data.ltoReg);
      setFcieFees(response.data.fcieReg);
      setMiscStickerFees(response.data.stickerReg);
      setMaintenanceCosts(response.data.maintenance);
      setTotalTrips(response.data.totalTrips);
      setTotalDieselConsumption(response.data.totalDieselConsumption);
      setTotalExpenses(response.data.totalExpenses);
      enqueueSnackbar("Yearly expense retrieved.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error occurred. Please check console.", {
        variant: "error",
      });
      console.error(error);
    }
  };

  //function to get and compute yearly costs and trips
  const computeYearlyTotalTripsAndFuelCosts = async () => {
    try {
      console.log(truckId);
      const response = await axios.get(
        `http://localhost:2222/expenses/monthly/${year}/${truckId}`
      );
      console.log(response);
      console.log(response.data);
      let totalYearlyTrips = 0;
      console.log(response.data[0].totalTrips);
      console.log(response.data[0].maintenance);
      console.log(response.data[0].dieselConsumption);
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
      setTotalExpenses(
        totalFuelCosts +
          totalMaintenance +
          parseInt(ltoFees) +
          parseInt(fcieFees) +
          parseInt(miscStickerFees)
      );
      console.log(totalExpenses);
      enqueueSnackbar("Calculation successful.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Process failed.", { variant: "error" });
      console.error(error);
    }
  };

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
        totalExpenses,
      };
      const response = await axios.put(
        `http://localhost:2222/expenses/yearly/${id}`,
        data
      );
      console.log(response);
      console.log(response.data);
      enqueueSnackbar("Yearly expense updated.", { variant: "success" });
      window.history.back();
    } catch (error) {
      enqueueSnackbar("Process failed.", { variant: "error" });
      console.error(error);
    }
  };

  //function to get yearly expense
  useEffect(() => {
    getYearlyExpense();
  }, [id]);

  return (
    <div className="p-4 mx-auto mt-4" style={{ width: "50%" }}>
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
          <button
            className="btn btn-success mx-auto d-flex mt-4 mb-4"
            onClick={computeYearlyTotalTripsAndFuelCosts}
          >
            Calculate
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-success mx-auto d-flex mt-4 mb-4"
            onClick={handleUpdateExpense}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

//edit trip - could use snackbars
export const EditTrip = () => {
  const [loading, setLoading] = useState(false);
  //states for trip details
  const [truckId, setTruckId] = useState("");
  const [driver, setDriver] = useState({});
  const [customer, setCustomer] = useState({});
  const [helper, setHelper] = useState({});
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [timeDispatched, setTimeDispatched] = useState("");
  const [timeReceived, setTimeReceived] = useState("");
  const [timeReturned, setTimeReturned] = useState("");
  const [status, setStatus] = useState("Pending");
  const [distance, setDistance] = useState("");
  const [dieselCost, setDieselCost] = useState("60");
  const [dieselConsumption, setDieselConsumption] = useState("");
  const [tollFee, setTollFee] = useState(0);
  const [pathway, setPathway] = useState(0);
  const [totalTripCost, setTotalTripCost] = useState("");
  const [truckType, setTruckType] = useState("");

  //navigation after edit
  const navigate = useNavigate();
  //get truck ID from URL params
  const { id } = useParams();

  async function getTrip() {
    try {
      const response = await axios.get(`http://localhost:2222/trips/${id}`);
      setTruckId(response.data.truck);
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
      console.error(error);
    }
  }

  useEffect(() => {
    getTrip();
  }, []);

  //functions to automatically compute diesel consumption and total trip cost
  function handleDistanceChange(event) {
    const newDistance = event.target.value;
    const newDieselConsumption = calculateDieselConsumption(
      newDistance,
      dieselCost
    );
    const newTotalTripCost = calculateTotalTripCost(
      newDieselConsumption,
      tollFee,
      pathway
    );
    setDistance(newDistance);
    setDieselConsumption(newDieselConsumption);
    setTotalTripCost(newTotalTripCost);
  }

  function handleDieselCostChange(event) {
    const newDieselCost = event.target.value;
    const newDieselConsumption = calculateDieselConsumption(
      distance,
      newDieselCost
    );
    const newTotalTripCost = calculateTotalTripCost(
      newDieselConsumption,
      tollFee,
      pathway
    );
    setDieselCost(newDieselCost);
    setDieselConsumption(newDieselConsumption);
    setTotalTripCost(newTotalTripCost);
  }

  function handleTollFeeChange(event) {
    const newTollFee = event.target.value;
    const newTotalTripCost = calculateTotalTripCost(
      dieselConsumption,
      newTollFee,
      pathway
    );
    setTollFee(newTollFee);
    setTotalTripCost(newTotalTripCost);
  }

  function handlePathwayChange(event) {
    const newPathway = event.target.value;
    const newTotalTripCost = calculateTotalTripCost(
      dieselConsumption,
      tollFee,
      newPathway
    );
    setPathway(newPathway);
    setTotalTripCost(newTotalTripCost);
  }

  function calculateDieselConsumption(distance, dieselCost) {
    if (truckType === "Forward") {
      const fuelConsumption = distance / 6; //if forward, divide by six, if elf, divide by 7
      const totalFuelCost = fuelConsumption * dieselCost;
      return totalFuelCost.toFixed(2);
    } else if (truckType === "Elf") {
      const fuelConsumption = distance / 7;
      const totalFuelCost = fuelConsumption * dieselCost;
      return totalFuelCost.toFixed(2);
    } else {
      const fuelConsumption = distance / 3;
      const totalFuelCost = fuelConsumption * dieselCost;
      return totalFuelCost.toFixed(2);
    }
  }

  function calculateTotalTripCost(dieselConsumption, tollFee, pathway) {
    if (!pathway) {
      const totalTripCost = parseFloat(dieselConsumption) + parseFloat(tollFee);
      return totalTripCost.toFixed(2);
    } else if (!tollFee) {
      const totalTripCost = parseFloat(dieselConsumption) + parseFloat(pathway);
      return totalTripCost.toFixed(2);
    } else {
      const totalTripCost =
        parseFloat(dieselConsumption) +
        parseFloat(tollFee) +
        parseFloat(pathway);
      return totalTripCost.toFixed(2);
    }
  }

  //function to create an expense
  const handleEditTrip = async () => {
    event.preventDefault();
    //construct message body
    try {
      const data = {
        driver,
        customer,
        helper,
        year,
        month,
        day,
        timeDispatched,
        timeReceived,
        timeReturned,
        status: status,
        distance,
        dieselCost,
        dieselConsumption,
        tollFee,
        pathway,
        totalTripExpense: totalTripCost,
      };
      setLoading(true);
      axios.put(`https://fmms-api.vercel.app/trips/?id=${id}`, data);
      setLoading(false);
      //use better alerts
      enqueueSnackbar("Trip updated.", { variant: "success" });
      navigate(`/trucks/details/${truckId}`); //navigate to truck details page
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Error occurred. Please check console.", {
        variant: "error",
      });
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="infoContainer p-4" style={{ minHeight: "100vh" }}>
        <form>
          <div className="row">
            <div className="col">
              <h2>
                <span className="logo">Edit</span> Trip
              </h2>
            </div>
          </div>

          <div className="row">
            <div className="col p-4">
              <div className="row">
                <h6>Trip Details</h6>
              </div>
              <div className="row">
                <label>Driver Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="driverName"
                  value={driver.name}
                  onChange={(e) =>
                    setDriver({ ...driver, name: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <label>Helper Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="helperName"
                  value={helper.name}
                  onChange={(e) =>
                    setHelper({ ...helper, name: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <label>Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="customerName"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <label>Customer Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="customerLocation"
                  value={customer.location}
                  onChange={(e) =>
                    setCustomer({ ...customer, location: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <label>Year</label>
                <input
                  type="string"
                  className="form-control"
                  name="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>
              <div className="row">
                <label>Month</label>
                <select
                  class="form-select"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
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
              </div>
              <div className="row">
                <label>Day</label>
                <input
                  type="string"
                  className="form-control"
                  name="day"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="col p-4">
              <div className="row">
                <h6>Trip Status</h6>
              </div>
              <div className="row">
                <label>Time Dispatched</label>
                <input
                  type="time"
                  className="form-control"
                  name="timeDispatched"
                  value={timeDispatched}
                  onChange={(e) => setTimeDispatched(e.target.value)}
                  required
                />
              </div>
              <div className="row">
                <label>Time Received</label>
                <input
                  type="time"
                  className="form-control"
                  name="timeReceived"
                  value={timeReceived}
                  onChange={(e) => setTimeReceived(e.target.value)}
                />
              </div>

              <div className="row">
                <label>Time Returned</label>
                <input
                  type="time"
                  className="form-control"
                  name="timeReturned"
                  value={timeReturned}
                  onChange={(e) => setTimeReturned(e.target.value)}
                />
              </div>
              <div className="row">
                <label>Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value={"Pending"}>Pending</option>
                  <option value={"Done"}>Done</option>
                </select>
              </div>
              <div className="row">
                <label>Distance (KM)</label>
                <input
                  type="text"
                  className="form-control"
                  name="distance"
                  value={distance}
                  onChange={handleDistanceChange}
                />
              </div>
            </div>
            <div className="col p-4">
              <div className="row">
                <h6>Trip Costs</h6>
              </div>
              <div className="row">
                <label>Diesel Price (/liter)</label>
                <input
                  type="text"
                  className="form-control"
                  name="dieselCost"
                  value={dieselCost}
                  onChange={handleDieselCostChange}
                />
              </div>

              <div className="row">
                <label>Toll Fees</label>
                <input
                  type="text"
                  className="form-control"
                  name="tollFee"
                  value={tollFee}
                  onChange={handleTollFeeChange}
                />
              </div>

              <div className="row">
                <label>Pathway Fees</label>
                <input
                  type="number"
                  className="form-control"
                  name="pathway"
                  value={pathway}
                  onChange={handlePathwayChange}
                />
              </div>
              <div className="row">
                <label>Total Fuel Cost</label>
                <input
                  type="text"
                  className="form-control"
                  name="dieselConsumption"
                  value={dieselConsumption}
                  readOnly
                  disabled
                />
              </div>
              <div className="row">
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
              </div>
            </div>
          </div>
          <div className="p-4 mx-auto mt-4" style={{ width: "50%" }}>
            <button
              className="btn btn-success mt-4 mx-auto d-flex"
              onClick={handleEditTrip}
            >
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
