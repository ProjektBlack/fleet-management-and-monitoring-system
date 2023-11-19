//dependencies
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/authProvider";
import axios from "axios";
//components
import { Spinner, BackButton, Sidebar, Dashboard } from "./Widgets";
import { TruckTable, YearlyExpensesTable, TripsTable } from "./Tables";
//icons
import { BsFillFilePlusFill } from "react-icons/bs";

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
    const [trucks, setTrucks] = useState({});
    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [yearlyExpenses, setYearlyExpenses] = useState([]);
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);
    const [trips, setTrips] = useState([]);
    const [driver, setDriver] = useState([{}]);
    const [customer, setCustomer] = useState([{}]);
    const [helper, setHelper] = useState([{}]);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                //get single truck
                const truckResponse = await axios.get(`http://localhost:2222/trucks/${id}`);
                const truckData = truckResponse.data;
                console.log(truckData.expenses)
                setTrucks(truckData);
                //checks if expenses is not null
                if (truckData.expenses) {
                    const expenseResponse = await axios.get(`http://localhost:2222/expenses/${truckData.expenses}`);
                    setExpenses(expenseResponse.data);
                    //checks if yearly expenses is not null
                    if (expenseResponse.data.yearlyExpenses) {
                        const yearlyExpensesResponse = await Promise.all(
                            //maps all yearly expenses related to the truck
                            expenseResponse.data.yearlyExpenses.map(async (yearlyExpenseId) => {
                                const response = await axios.get(`http://localhost:2222/yearlyexpenses/${yearlyExpenseId}`);
                                return response.data;
                            })
                        );
                        //sets yearly expenses
                        setYearlyExpenses(yearlyExpensesResponse);
                    }
                    //checks if monthly expenses is not null
                    if (expenseResponse.data.monthlyExpenses) {
                        const monthlyExpensesResponse = await Promise.all(
                            expenseResponse.data.monthlyExpenses.map(async (monthlyExpenseId) => {
                                //maps all monthly expenses related to the truck
                                const response = await axios.get(`http://localhost:2222/monthlyexpenses/${monthlyExpenseId}`);
                                return response.data;
                            })
                        );
                        //sets monthly expenses
                        setMonthlyExpenses(monthlyExpensesResponse);
                    }
                    //checks if trips is not null
                    if (truckData.trips) {
                        const tripsResponse = await Promise.all(
                            truckData.trips.map(async (tripId) => {
                                const response = await axios.get(`http://localhost:2222/trips/${tripId}`);
                                return response.data;
                            })
                        );
                        setTrips(tripsResponse);
                    } else {
                        console.log("No trips");
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    return (
        <div style={{ minHeight: "95vh" }}>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '95vh' }}>
                    <Spinner />
                </div>
            ) : (
                <div className="row p-4">
                    <div className="col-3">
                        <h2>Plate Number {trucks.plateNumber}</h2>
                        <div className="row">
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
                        <h6>Type</h6>
                        <p>{trucks.truckType}</p>
                    </div>
                    <div className="col">
                        <div className="row">
                            <h2>Expenses</h2>
                            <h6>Operations</h6>
                            <div className="col-1">
                                <Link to={`/expenses/new/${trucks.expenses}/${id}`} className="btn btn-success">Add</Link>
                            </div>
                        </div>

                        <div>
                            <h6>Yearly Expenses</h6>
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Year</th>
                                        <th>LTO Registration</th>
                                        <th>FCIE Registration</th>
                                        <th>Sticker Registration</th>
                                        <th>Maintenance</th>
                                        <th>Total Expenses</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {yearlyExpenses.map((expense, index) => (
                                        <tr key={index}>
                                            <td>{expense.year}</td>
                                            <td>{expense.ltoReg}</td>
                                            <td>{expense.fcieReg}</td>
                                            <td>{expense.stickerReg}</td>
                                            <td>{expense.maintenance}</td>
                                            <td>{expense.totalExpenses}</td>
                                            <td><Link className="btn btn-outline-warning" to={`/expenses/yearly/edit/${expense._id}/${id}`}>Edit</Link><button className='btn btn-outline-danger'>Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h6>Monthly Expenses</h6>
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Year</th>
                                        <th>Month</th>
                                        <th>Maintenance</th>
                                        <th>Total Trips</th>
                                        <th>Diesel Consumption</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyExpenses.map((expense, index) => (
                                        <tr key={expense.month}>
                                            <td>{expense.year}</td>
                                            <td>{expense.month}</td>
                                            <td>{expense.maintenance}</td>
                                            <td>{expense.totalTrips}</td>
                                            <td>{expense.dieselConsumption}</td>
                                            <td><Link className="btn btn-outline-warning" to={`/expenses/monthly/edit/${expense._id}/${id}`}>Edit</Link><button className='btn btn-outline-danger'>Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col">
                        <h2>Trips</h2>
                        <div className="col-1">
                            <h6>Operations</h6>
                            <Link to={`/newtrips/${id}`} className="btn btn-success">Add</Link>
                        </div>
                        <h5 className="mb-2">Recent Trips</h5>
                        <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "50vh" }}>

                            <table className="table table-bordered table-hover" >
                                <thead>
                                    <tr>
                                        <th>Driver</th>
                                        <th>Helper</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Time Dispatched</th>
                                        <th>Time Received</th>
                                        <th>Time Returned</th>
                                        <th>Total Fuel Cost</th>
                                        <th>Toll Fee Cost</th>
                                        <th>Pathway Cost</th>
                                        <th>Total Trip Cost</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trips.sort((a, b) => new Date(b.date) - new Date(a.date)).map((trip, index) => (
                                        <tr key={index}>
                                            <td>{trip.driver.name}</td>
                                            <td>{trip.helper.name}</td>
                                            <td>{trip.customer.name}</td>
                                            <td>{trip.month} {trip.day}, {trip.year} </td>
                                            <td>{trip.timeDispatched}</td>
                                            <td>{trip.timeReceived}</td>
                                            <td>{trip.timeReturned}</td>
                                            <td>{trip.dieselConsumption}</td>
                                            <td>{trip.tollFee}</td>
                                            <td>{trip.pathway}</td>
                                            <td>{trip.totalTripExpense}</td>
                                            <td>{trip.status}</td>
                                            <td><Link className="btn btn-outline-warning" to={`/trips/edit/${trip._id}`}>Edit</Link><button className='btn btn-outline-danger'>Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )
            }
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