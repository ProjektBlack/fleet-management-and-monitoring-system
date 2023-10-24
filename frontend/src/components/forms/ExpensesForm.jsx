import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

//ui cleanup: icons, buttons 
//auto-compute: total expenses, total trips

const CreateExpense = () => {
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState("option1");

    //states for yearly expenses
    const [year, setYear] = useState("");
    const [ltoFees, setLtoFees] = useState("");
    const [fcieFees, setFcieFees] = useState("");
    const [miscStickerFees, setMiscStickerFees] = useState("");
    const [maintenanceCosts, setMaintenanceCosts] = useState("");
    //states for monthly expenses
    const [month, setMonth] = useState("");
    const [monthlyMaintenanceCosts, setMonthlyMaintenanceCosts] = useState("");
    const [dieselCosts, setDieselCosts] = useState("");


    // set the expense ID state to the ID from the URL params
    const { expensesId } = useParams();

    //function to create an expense
    const handleCreateExpense = async () => {
        console.log(expensesId);
        //checks if selected type is yearly
        if (selectedType === "option1") {
            try {
                const data = {
                    year,
                    ltoReg: ltoFees,
                    fcieReg: fcieFees,
                    stickerReg: miscStickerFees,
                    maintenance: maintenanceCosts
                };
                setLoading(true);
                const response = await axios.post('http://localhost:2222/yearlyexpenses', data);
                const newObjectID = response.data._id;
                const getObject = await axios.get(`http://localhost:2222/expenses/${expensesId}`);
                getObject.data.yearlyExpenses.push(newObjectID);
                await axios.put(`http://localhost:2222/expenses/${expensesId}`, getObject.data);
                setLoading(false);
                alert("Expense Created");
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
                    month, maintenance: monthlyMaintenanceCosts, dieselConsumption: dieselCosts
                };
                setLoading(true);
                const response = await axios.post('http://localhost:2222/monthlyexpenses', data);
                const newObjectID = response.data._id;
                const getObject = await axios.get(`http://localhost:2222/expenses/${expensesId}`);
                getObject.data.monthlyExpenses.push(newObjectID);
                await axios.put(`http://localhost:2222/expenses/${expensesId}`, getObject.data);
                setLoading(false);
                alert("Expense Created");
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
                    onChange={(e) => setMaintenanceCosts(e.target.value)}
                />
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