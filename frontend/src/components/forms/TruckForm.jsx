import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateTruck = (props) => {
    const [TruckID, setTruckID] = useState('')
    const [PlateNo, setPlateNo] = useState('')
    const [TruckType, setTruckType] = useState('')
    const [Revenue, setRev] = useState('')
    const [Depreciation, setDep] = useState('')
    const [Amortization, setAmor] = useState('')
    const [TotalFeeExpenses, setTFE] = useState('')
    const [FCIE, setFCIE] = useState('')
    const [REGISTRATION, setReg] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const handleCreateTruck = async () => {
        try {
            const data = {
                TruckID, PlateNo, TruckType, Revenue, Depreciation, Amortization, TotalFeeExpenses, FCIE, REGISTRATION
            };
            setLoading(true);
            await axios.post('http://localhost:2222/tempstruck', data);
            setLoading(false);
            navigate("/trucks")
        } catch (error) {
            setLoading(false);
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    };
    return (

        <div className="row">
            <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
                <h5>Create New Truck</h5>
                <label>Enter Truck ID: </label>
                <input type="text" value={TruckID} onChange={(e) => setTruckID(e.target.value)} className="form-control"></input>
                <label>Enter Plate Number: </label>
                <input type="text" value={PlateNo} onChange={(e) => setPlateNo(e.target.value)} className="form-control"></input>
                <label>Enter Truck Type: </label>
                <input type="text" value={TruckType} onChange={(e) => setTruckType(e.target.value)} className="form-control"></input>
                <label>Enter Revenue: </label>
                <input type="text" value={Revenue} onChange={(e) => setRev(e.target.value)} className="form-control"></input>
                <label>Enter Depreciation: </label>
                <input type="text" value={Depreciation} onChange={(e) => setDep(e.target.value)} className="form-control"></input>
                <label>Enter Amortization: </label>
                <input type="text" value={Amortization} onChange={(e) => setAmor(e.target.value)} className="form-control"></input>
                <label>Enter Total Fee Expenses: </label>
                <input type="text" value={TotalFeeExpenses} onChange={(e) => setTFE(e.target.value)} className="form-control"></input>
                <label>Enter FCIE Registration Amount): </label>
                <input type="text" value={FCIE} onChange={(e) => setFCIE(e.target.value)} className="form-control"></input>
                <label>Enter Registration Fee: </label>
                <input type="text" value={REGISTRATION} onChange={(e) => setReg(e.target.value)} className="form-control"></input>
                <button className="btn btn-success mx-auto d-flex mt-4 mb-4" onClick={handleCreateTruck}>Create</button>
            </div>
        </div>
    )
}

export default CreateTruck