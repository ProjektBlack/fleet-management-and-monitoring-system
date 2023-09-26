import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateExpense = (props) => {
    const [ExpensesID, setExpensesID] = useState('');
    const [ExpensesRevenue, setExpensesRevenue] = useState('');
    const [DepreciationExpenses, setDepreciationExpenses] = useState('');
    const [ExpensesAmortization, setExpensesAmortization] = useState('');
    const [MaintenanceCost, setMaintenanceCost] = useState('');
    const [TruckRegis, setTruckRegis] = useState('');
    const [Sticker, setSticker] = useState('');
    const [DriverSalary, setDriverSalary] = useState('');
    const [HelperSalary, setHelperSalary] = useState('');
    const [Trips, setTrips] = useState('');
    const [TotalKm, setTotalKm] = useState('');
    const [TotalExpense, setTotalExpense] = useState('');
    const [CostAve, setCostAve] = useState('');
    const [TollFee, setTollFee] = useState('');
    const [Diesel, setDiesel] = useState('');
    const [DieselpLiters, setDieselpLiters] = useState('');
    const [OtherExpense, setOtherExpense] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateExpense = async () => {
        try {
            const data = {
                ExpensesID,
                ExpensesRevenue,
                DepreciationExpenses,
                ExpensesAmortization,
                MaintenanceCost,
                TruckRegis,
                Sticker,
                DriverSalary,
                HelperSalary,
                Trips,
                TotalKm,
                TotalExpense,
                CostAve,
                TollFee,
                Diesel,
                DieselpLiters,
                OtherExpense,
            };
            setLoading(true);
            await axios.post('http://localhost:2222/expenses', data);
            setLoading(false);
            navigate("/expenses");
        } catch (error) {
            setLoading(false);
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    };

    return (
        <div className="row">
            <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
                <h5>Create New Expense</h5>
                <label>Expenses ID: </label>
                <input
                    type="number"
                    value={ExpensesID}
                    onChange={(e) => setExpensesID(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Expenses Revenue: </label>
                <input
                    type="number"
                    value={ExpensesRevenue}
                    onChange={(e) => setExpensesRevenue(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Depreciation Expenses: </label>
                <input
                    type="number"
                    value={DepreciationExpenses}
                    onChange={(e) => setDepreciationExpenses(e.target.value)}
                    className="form-control"
                    required
                />
                <label>Expenses Amortization: </label>
                <input
                    type="number"
                    value={ExpensesAmortization}
                    onChange={(e) => setExpensesAmortization(e.target.value)}
                    className="form-control"
                    required
                />
                {/* Add the remaining input fields for expenses */}
                {/* ... */}
                <button
                    className="btn btn-success mx-auto d-flex mt-4 mb-4"
                    onClick={handleCreateExpense}
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default CreateExpense;