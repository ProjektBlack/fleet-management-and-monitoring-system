import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const EditMonthlyExpense = () => {
    //states for monthly expenses
    const [month, setMonth] = useState("");
    const [monthlyMaintenanceCosts, setMonthlyMaintenanceCosts] = useState("");
    const [dieselCosts, setDieselCosts] = useState("");
    //get object id from url
    const { id } = useParams();

    //function to get monthly expense
    useEffect(() => {
        const getYearlyExpense = async () => {
            try {
                const response = await axios.get(`http://localhost:2222/monthlyexpenses/${id}`);
                console.log(response);
                setMonth(response.data.month);
                setMonthlyMaintenanceCosts(response.data.maintenance);
                setDieselCosts(response.data.dieselConsumption);
            } catch (error) {
                alert("Error occurred. Please check console.");
                console.error(error);
            }
        };
        getYearlyExpense();
    }, [id]);

    //function to update monthly expense
    const handleUpdateExpense = async () => {
        try {
            const data = {
                month, maintenance: monthlyMaintenanceCosts, dieselConsumption: dieselCosts
            };
            const response = await axios.put(`http://localhost:2222/monthlyexpenses/${id}`, data);
            console.log(response);
            console.log(response.data)
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
                />
                <button
                    className="btn btn-success mx-auto d-flex mt-4 mb-4"
                    onClick={handleUpdateExpense}
                >
                    Edit
                </button>
            </div>
        </div >
    )
}

export default EditMonthlyExpense