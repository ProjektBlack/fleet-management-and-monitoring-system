import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { useParams } from "react-router-dom";
// comments: better ui, add expenses, add trips and show trips, add edit functionality
const ShowTruck = () => {
    const [trucks, setTrucks] = useState({});
    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [yearlyExpenses, setYearlyExpenses] = useState([]);
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const truckResponse = await axios.get(`http://localhost:2222/trucks/${id}`);
                const truckData = truckResponse.data;
                setTrucks(truckData);

                if (truckData.expenses) {
                    const expenseResponse = await axios.get(`http://localhost:2222/expenses/${truckData.expenses}`);
                    setExpenses(expenseResponse.data);

                    if (expenseResponse.data.yearlyExpenses) {
                        const yearlyExpensesResponse = await Promise.all(
                            expenseResponse.data.yearlyExpenses.map(async (yearlyExpenseId) => {
                                const response = await axios.get(`http://localhost:2222/yearlyexpenses/${yearlyExpenseId}`);
                                return response.data;
                            })
                        );
                        setYearlyExpenses(yearlyExpensesResponse);
                    }

                    if (expenseResponse.data.monthlyExpenses) {
                        const monthlyExpensesResponse = await Promise.all(
                            expenseResponse.data.monthlyExpenses.map(async (monthlyExpenseId) => {
                                const response = await axios.get(`http://localhost:2222/monthlyexpenses/${monthlyExpenseId}`);
                                return response.data;
                            })
                        );
                        setMonthlyExpenses(monthlyExpensesResponse);
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
        <div style={{ minHeight: "100vh" }} className="d-flex justify-content-center align-items-center">
            {loading ? (
                <Spinner />
            ) : (
                <div className="card p-4" style={{ width: "25%" }}>
                    <h1>Plate Number {trucks.plateNumber}</h1>
                    <h6>Type</h6>
                    <p>{trucks.truckType}</p>
                    <div>
                        <div>
                            <h6>Yearly Expenses</h6>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Year</th>
                                        <th>LTO Registration</th>
                                        <th>FCIE Registration</th>
                                        <th>Sticker Registration</th>
                                        <th>Maintenance</th>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <h6>Monthly Expenses</h6>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th>Maintenance</th>
                                        <th>Diesel Consumption</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyExpenses.map((expense, index) => (
                                        <tr key={expense.month}>
                                            <td>{expense.month}</td>
                                            <td>{expense.maintenance}</td>
                                            <td>{expense.dieselConsumption}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <p>{trucks.trips}</p>
                </div>
            )}
        </div>
    );
};

export default ShowTruck;
