import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateTruck = () => {
    const [newTruck, setNewTruck] = useState({}) //state for new truck object
    const [plateNumber, setPlateNumber] = useState('')
    const [truckType, setTruckType] = useState('')
    const [expenses, setExpenses] = useState({
        yearlyExpenses: [],
        monthlyExpenses: []
    })

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

export default CreateTruck