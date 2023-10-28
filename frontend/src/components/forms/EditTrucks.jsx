import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const EditTruck = () => {
    const [newTruck, setNewTruck] = useState({}) //state for new truck object
    const [plateNumber, setPlateNumber] = useState('')
    const [truckType, setTruckType] = useState('')
    const { id } = useParams();

    //get truck ID from url then set states
    useEffect(() => {
        const getTruck = async () => {
            try {
                const response = await axios.get(`http://localhost:2222/trucks/${id}`);
                setNewTruck(response.data);
                setPlateNumber(response.data.plateNumber);
                setTruckType(response.data.truckType);
            } catch (error) {
                console.error(error);
            }
        };
        getTruck();
    }, [])

    //function to create a new truck
    const handleUpdateTruck = async () => {
        try {
            const data = {
                plateNumber,
                truckType,
            };
            const response = await axios.put(`http://localhost:2222/trucks/${id}`, data) //update truck
            console.log(response.data);
        } catch (error) {
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    };

    return (
        <div className="row">
            <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
                <h5>Edit Truck</h5>
                <label>Plate Number </label>
                <input type="text" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} className="form-control"></input>
                <label>Truck Type </label>
                <input type="text" value={truckType} onChange={(e) => setTruckType(e.target.value)} className="form-control"></input>
                <button className="btn btn-success mx-auto d-flex mt-4 mb-4" onClick={handleUpdateTruck}>Edit</button>
            </div>
        </div>
    )
}

export default EditTruck