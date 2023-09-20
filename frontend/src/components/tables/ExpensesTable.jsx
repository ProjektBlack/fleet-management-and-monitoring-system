import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
//import components
import Sidebar from "../Sidebar";
import Spinner from "../Spinner";
import { Expenses } from "../../../../backend/models/models";
//table's kinda squished - change layout later
//general analysis of how this works
const ExpensesTable = () => {
    // rendering load states
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);

    // get data
    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:2222/expenses")
            .then((response) => {
                setExpenses(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }, [])

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <div style={{ overflowX: "auto", marginLeft: "17%" }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Expenses ID</th>
                                <th>Revenue</th>
                                <th>Depreciation</th>
                                <th>Amortization</th>
                                <th>Maintenance Cost</th>
                                <th>Registration</th>
                                <th>Sticker</th>
                                <th>Driver Salary</th>
                                <th>Helper Salary</th>
                                <th>Trips</th>
                                <th>Total Km</th>
                                <th>Total Expenses</th>
                                <th>Cost Ave.</th>
                                <th>Toll Fee</th>
                                <th>Diesel</th>
                                <th>Diesel per Liter</th>
                                <th>Other Expenses</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* renders the information */}
                            {expenses.map((expense, index) => (
                                <tr key={expense.ExpensesID}>
                                    <td>{expense.ExpensesID}</td>
                                    <td>{expense.ExpensesRevenue}</td>
                                    <td>{expense.DepreciationExpenses}</td>
                                    <td>{expense.ExpensesAmortization}</td>
                                    <td>{expense.MaintenanceCost}</td>
                                    <td>{expense.TruckRegis}</td>
                                    <td>{expense.Sticker}</td>
                                    <td>{expense.DriverSalary}</td>
                                    <td>{expense.HelperSalary}</td>
                                    <td>{expense.Trips}</td>
                                    <td>{expense.TotalKm}</td>
                                    <td>{expense.TotalExpense}</td>
                                    <td>{expense.CostAve}</td>
                                    <td>{expense.TollFee}</td>
                                    <td>{expense.Diesel}</td>
                                    <td>{expense.DieselpLiters}</td>
                                    <td>{expense.OtherExpense}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ExpensesTable;