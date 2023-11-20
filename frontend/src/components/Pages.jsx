//dependencies
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/authProvider";
import axios from "axios";
//components
import { Spinner, BackButton, Sidebar, Dashboard } from "./Widgets";
import { TruckTable, YearlyExpensesTable, TripsTable } from "./Tables";
//icons
import { BsFillFilePlusFill, BsEye } from "react-icons/bs";

//login page
export const Login = () => {
    //global state for authentication
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const { login } = useAuth();
    //states for login page
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //displays error message if login fails
    const [error, setError] = useState("");
    //used to navigate to home page after login
    //loading state for login
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //function to handle login
    const handleLogin = async () => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:2222/login", {
                username,
                password,
            });
            const { token } = response.data;
            login(token);
            setUsername("");
            setPassword("");
            setIsAuthenticated(true);
            navigate("/home");
        } catch (error) {
            console.log(error);
            setError(error.response.data.message || "Something went wrong. Please contact support.");
        }
    };

    const areFormsFilled = () => {
        if (username === "" || password === "") {
            return false;
        } else {
            return true;
        }
    }

    return (
        <div>
            <div id="loginBackground" className="d-flex align-items-center justify-content-center">
                <div id="loginPanel" className="d-flex align-items-center justify-content-center">
                    <form onSubmit={handleLogin}>
                        <h3 className="logo">FMMS</h3>
                        <div className="row mb-2">
                            <label className="mb-2">Username</label>
                            <input className="form-control" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="row mb-4">
                            <label className="mb-2">Password</label>
                            <input className="form-control" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            <div className="text-danger">{error}</div>
                        </div>
                        <button className="btn btn-success mt-3 mx-auto d-flex fs-6 ${areFormsFilled() ? '' : disabled}" type="submit" disabled={!areFormsFilled()}> Log In</button>
                        <div className='text-center mt-1'>
                            <Link to={"/register"} className='text-muted text-decoration-none fw-light'>Not yet registered?</Link>
                        </div>

                    </form>
                </div>
            </div>
        </div >
    );
};

//page not found
export const Missing = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <BackButton />
        </div>
    );
};

//dashboard
export const Home = () => {
    return (
        <div className="row g-2">
            <div className="col-2">
                <Sidebar />
            </div>
            <div id="dashboardContainer" className="col border-0 rounded">
                <Dashboard />
            </div>
        </div>
    );
}

//manage trucks
export const ManageTruck = () => {
    return (
        <div>
            <div className="row g-2">
                <div className="col-2">
                    <Sidebar />
                </div>
                <div id="dashboardContainer" className="col border-0 rounded p-4">
                    <div className="row border-start border-success rounded border-5 dsContainer mb-3">
                        <div className="col-10 p-4">
                            <h1>Manage Trucks</h1>
                        </div>
                        <div className="col-2 mt-4 text-end">
                            <Link to="/trucks/new"><BsFillFilePlusFill id="newIcon" /></Link>
                        </div>
                    </div>
                    <div className="row border-start border-success rounded border-5 dsContainer tableContainer">
                        <TruckTable />
                    </div>
                </div>
            </div>
        </div>
    )
}

//show truck details
export const ShowTruck = () => {
    const [loading, setLoading] = useState(false);
    const [truckInfo, setTruckInfo] = useState({}); //info and ids
    const [expenses, setExpenses] = useState([]); //ids
    const [yearlyExpenses, setYearlyExpenses] = useState([]); //datas to map
    const [monthlyExpenses, setMonthlyExpenses] = useState([]); //datas to map
    const [trips, setTrips] = useState([]); //datas to map
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                //get single truck
                const response = await axios.get(`http://localhost:2222/trucks/${id}`);
                const truckData = response.data;
                setTruckInfo(truckData);
                console.log(truckData);
                setExpenses(truckData.expenses);
                //get all yearly expenses and their data based on the references on expenses.yearlyExpenses
                if (truckData && truckData.expenses && truckData.expenses.yearlyExpenses && truckData.expenses.yearlyExpenses.length > 0) {
                    const yearlyExpensesData = await Promise.all(truckData.expenses.yearlyExpenses.map(async (expense) => {
                        const response = await axios.get(`http://localhost:2222/expenses/yearly/${expense}`);
                        return response.data;
                    }));
                    setYearlyExpenses(yearlyExpensesData);
                }
                if (truckData && truckData.expenses && truckData.expenses.monthlyExpenses && truckData.expenses.monthlyExpenses.length > 0) {
                    //get all monthly expenses based on the references on expenses.monthlyExpenses
                    const monthlyExpensesData = await Promise.all(truckData.expenses.monthlyExpenses.map(async (expense) => {
                        const response = await axios.get(`http://localhost:2222/expenses/monthly/${expense}`);
                        return response.data;
                    }));
                    setMonthlyExpenses(monthlyExpensesData);
                }
                if (truckData && truckData.trips.length > 0) {
                    //get all trips and their data based on the reference ids
                    const tripData = await Promise.all(truckData.trips.map(async (trip) => {
                        const response = await axios.get(`http://localhost:2222/trips/${trip}`);
                        return response.data;
                    }));
                    setTrips(tripData);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const deleteTrip = async (tripId) => {
        try {
            // Make the DELETE request
            await axios.delete(`http://localhost:2222/trips/${tripId}`);

            // Remove the deleted trip from the local state
            setTrips(trips.filter(trip => trip._id !== tripId));
        } catch (error) {
            // Log the error
            console.error(error);
        }
    };

    const deleteMonthlyExpense = async (expenseId) => {
        try {
            // Make the DELETE request
            await axios.delete(`http://localhost:2222/expenses/monthly/${expenseId}`);

            // Remove the deleted expense from the local state
            setMonthlyExpenses(monthlyExpenses.filter(expense => expense._id !== expenseId));
        } catch (error) {
            // Log the error
            console.error(error);
        }
    };

    const deleteYearlyExpense = async (expenseId) => {
        try {
            // Make the DELETE request
            await axios.delete(`http://localhost:2222/expenses/yearly/${expenseId}`);

            // Remove the deleted expense from the local state
            setYearlyExpenses(yearlyExpenses.filter(expense => expense._id !== expenseId));
        } catch (error) {
            // Log the error
            console.error(error);
        }
    };

    const truckAvailability = (truck) => {
        const hasPendingTrips = Array.isArray(truck.trips) && truck.trips.some(trip => trip.status === 'pending' || trip.status === 'Pending');
        const isUnderMaintenance = truck.underMaintenance;

        if (hasPendingTrips || isUnderMaintenance) {
            return 'Unavailable';
        } else {
            return 'Available';
        }
    };

    return (
        <div className="container" style={{ minHeight: "100vh" }}>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '95vh' }}>
                    <Spinner />
                </div>
            ) : (
                <div className="row p-4">
                    <div className="col-3">
                        <div className='container rounded p-4 infoContainer border-bottom border-5 border-success'>
                            <h2><span className='logo'>Plate No.</span> {truckInfo.plateNumber}</h2>
                            <div className="row mb-2">
                                <h6>Operations</h6>
                                <div className="col">
                                    <button className="btn btn-success">Edit</button>
                                </div>
                                <div className="col">
                                    <button className="btn btn-danger">Delete</button>
                                </div>
                                <div className="col">
                                    <BackButton />
                                </div>
                            </div>
                            <div className='row'>
                                <h6>Type</h6>
                                <p className='text-muted'>{truckInfo.truckType}</p>
                            </div>
                            <div className='row'>
                                <h6>Status</h6>
                                <p className='text-muted'>{truckAvailability(truckInfo)}</p>
                            </div>
                            <div className='row'>
                                <h6>Maintenance Status</h6>
                                <p className='text-muted'>{truckInfo.underMaintenance ? "Under Maintenance" : "Not Under Maintenance"}</p>
                            </div>
                        </div>

                    </div>
                    <div className="col border rounded p-4 infoContainer">
                        <div className='container'>
                            <div className="row">
                                <h2>Expenses</h2>
                                <h6>Operations</h6>
                                <div className="col-1">
                                    <Link to={`/expenses/new/${id}`} className="btn btn-success">Add</Link>
                                </div>
                            </div>
                            <div>
                                <h6>Yearly Expenses</h6>
                                <table className='table table-bordered table-hover'>
                                    <thead className="">
                                        <th>Year</th>
                                        <th>LTO Fees</th>
                                        <th>FCIE Fees</th>
                                        <th>Sticker Fees</th>
                                        <th>Maintenance Costs</th>
                                        <th>Total Trips</th>
                                        <th>Total Diesel Consumption</th>
                                        <th>Total Expenses</th>
                                        <th>Operations</th>
                                    </thead>
                                    <tbody>
                                        {yearlyExpenses.map((expense) => (
                                            <tr key={expense._id}>
                                                <td>{expense.year}</td>
                                                <td>{expense.ltoReg}</td>
                                                <td>{expense.fcieReg}</td>
                                                <td>{expense.stickerReg}</td>
                                                <td>{expense.maintenance}</td>
                                                <td>{expense.totalTrips}</td>
                                                <td>{expense.totalDieselConsumption}</td>
                                                <td>{expense.totalExpenses}</td>
                                                <td className="text-center">
                                                    <Link id="showIcon" to={`/expenses/yearly/edit/${expense._id}/${id}`} style={{ marginRight: '2%' }}><BsEye /></Link>
                                                    <button onClick={() => deleteYearlyExpense(expense._id)}>Delete</button>
                                                    <Link to={`/expenses/yearly/edit/${expense._id}`} style={{ marginLeft: '2%' }}>Edit</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h6>Monthly Expenses</h6>
                                <table className="table table-bordered table-hover ">
                                    <thead className="">
                                        <th>Month</th>
                                        <th>Year</th>
                                        <th>Maintenance Cost</th>
                                        <th>Total Trips</th>
                                        <th>Diesel Consumption</th>
                                        <th>Total Monthly Expenses</th>
                                        <th>Operations</th>
                                    </thead>
                                    <tbody>
                                        {monthlyExpenses.map((expense) => (
                                            <tr key={expense._id}>
                                                <td>{expense.month}</td>
                                                <td>{expense.year}</td>
                                                <td>{expense.maintenance}</td>
                                                <td>{expense.totalTrips}</td>
                                                <td>{expense.dieselConsumption}</td>
                                                <td>{expense.totalMonthlyExpenses}</td>
                                                <td className="text-center">
                                                    <Link id="showIcon" to={`/expenses/monthly/edit/${expense._id}/${id}`} style={{ marginRight: '2%' }}><BsEye /></Link>
                                                    <button onClick={() => deleteMonthlyExpense(expense._id)}>Delete</button>
                                                    <Link to={`/expenses/monthly/edit/${expense._id}`} style={{ marginLeft: '2%' }}>Edit</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </div>
            )
            }
            <div className="row p-1">
                <div className='col'>
                    <div className='p-4 rounded infoContainer border-success border-5 border-top'>
                        <h2>Trips</h2>
                        <div className="col-1">
                            <h6>Operations</h6>
                            <Link to={`/newtrips/${id}`} className="btn btn-success">Add</Link>
                        </div>
                        <h5 className="mb-2">Recent Trips</h5>
                        <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "50vh" }}>
                            <table className="table table-bordered table-hover ">
                                <thead className="">
                                    <tr className="bg-primary">
                                        <th style={{}}>Customer</th>
                                        <th style={{}}>Customer Location</th>
                                        <th style={{}}>Driver</th>
                                        <th style={{}}>Helper</th>
                                        <th style={{}}>Date</th>
                                        <th style={{}}>Time Dispatched</th>
                                        <th style={{}}>Time Received</th>
                                        <th style={{}}>Time Returned</th>
                                        <th style={{}}>Status</th>
                                        <th style={{}}>Distance</th>
                                        <th style={{}}>Diesel Consumption</th>
                                        <th style={{}}>Toll Fees</th>
                                        <th style={{}}>Pathway Fees</th>
                                        <th style={{}}>Total Trip Expenses</th>
                                        <th style={{}}>Operations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trips.map((trip) => (
                                        <tr key={trip._id}>
                                            <td>{trip.customer.name}</td>
                                            <td>{trip.customer.location}</td>
                                            <td>{trip.driver.name}</td>
                                            <td>{trip.helper.name}</td>
                                            <td>{trip.month} {trip.day}, {trip.year}</td>
                                            <td>{trip.timeDispatched}</td>
                                            <td>{trip.timeReceived}</td>
                                            <td>{trip.timeReturned}</td>
                                            <td>{trip.status}</td>
                                            <td>{trip.distance}</td>
                                            <td>{trip.dieselConsumption}</td>
                                            <td>{trip.tollFee}</td>
                                            <td>{trip.pathway}</td>
                                            <td>{trip.totalTripExpense}</td>
                                            <td className="text-center">
                                                <Link id="showIcon" to={`/trips/details/${trip._id}`} style={{ marginRight: '2%' }}><BsEye /></Link>
                                                <button onClick={() => deleteTrip(trip._id)}>Delete</button>
                                                <Link to={`/trips/edit/${trip._id}`} style={{ marginLeft: '2%' }}>Edit</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

//manage expenses
export const ManageYearlyExpenses = () => {
    return (
        <div>
            <div className="row">
                <div className="col-2">
                    <Sidebar />
                </div>
                <div className="col-10">
                    <div className="row d-flex mx-auto mb-4 mt-4">
                        <div className="col-10">
                            <h1 style={{ marginTop: "10%" }}>Yearly Expenses</h1>
                        </div>
                        <div className="col">
                            <select className="form-select" style={{ marginTop: "150%" }}>
                                <option selected>Sort</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                        <div className="col">
                            <input className='form-control' style={{ marginTop: "150%" }}></input>
                        </div>
                    </div>
                    <div className="row">
                        <YearlyExpensesTable />
                    </div>
                </div>
            </div>

        </div >
    )
}