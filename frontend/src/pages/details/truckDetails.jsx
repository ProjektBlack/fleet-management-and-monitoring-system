import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/widgets/subcomponents/sidebar";
import axios from "axios";
import Spinner from "../../components/widgets/subcomponents/Spinner";
import ReturnButton from "../../components/widgets/subcomponents/ReturnButton";
import { useParams } from "react-router-dom";
// comments: better ui, add expenses, add trips , add edit functionality
const ShowTruck = () => {
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
                    <div className="col">
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
                                <ReturnButton />
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
                                            <td><Link className="btn btn-outline-warning" to={`/expenses/yearly/edit/${expense._id}/${id}`}>Edit</Link></td>
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
                                            <td><Link className="btn btn-outline-warning" to={`/expenses/monthly/edit/${expense._id}/${id}`}>Edit</Link></td>
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
                                        <th>Customer</th>
                                        <th>Helper</th>
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
                                            <td>{trip.customer.name}</td>
                                            <td>{trip.helper.name}</td>
                                            <td>{trip.month} {trip.day}, {trip.year} </td>
                                            <td>{trip.timeDispatched}</td>
                                            <td>{trip.timeReceived}</td>
                                            <td>{trip.timeReturned}</td>
                                            <td>{trip.dieselConsumption}</td>
                                            <td>{trip.tollFee}</td>
                                            <td>{trip.pathway}</td>
                                            <td>{trip.totalTripExpense}</td>
                                            <td>{trip.status}</td>
                                            <td><Link className="btn btn-outline-warning" to={`/trips/edit/${trip._id}`}>Edit</Link></td>
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

export default ShowTruck;
