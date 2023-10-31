import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const EditYearlyExpense = () => {
    //states for yearly expenses
    const [year, setYear] = useState("");
    const [ltoFees, setLtoFees] = useState("0");
    const [fcieFees, setFcieFees] = useState("0");
    const [miscStickerFees, setMiscStickerFees] = useState("0");
    const [maintenanceCosts, setMaintenanceCosts] = useState("0");
    const [totalDieselConsumption, setTotalDieselConsumption] = useState("");
    const [totalExpenses, setTotalExpenses] = useState("0");
    const [totalTrips, setTotalTrips] = useState("");
    //get object id from url
    const { id, truckId } = useParams();

    //function to get yearly expense
    useEffect(() => {
        const getYearlyExpense = async () => {
            try {
                const response = await axios.get(`http://localhost:2222/yearlyexpenses/${id}`);
                console.log(response);
                setYear(response.data.year);
                setLtoFees(response.data.ltoReg);
                setFcieFees(response.data.fcieReg);
                setMiscStickerFees(response.data.stickerReg);
                setMaintenanceCosts(response.data.maintenance);
            } catch (error) {
                alert("Error occurred. Please check console.");
                console.error(error);
            }
        };
        getYearlyExpense();
    }, [id]);

    //function to get and compute yearly costs and trips
    const computeYearlyTotalTripsAndFuelCosts = async () => {
        try {
            console.log(truckId)
            const response = await axios.get(`http://localhost:2222/monthly/expenses/${truckId}/${year}`);
            const trips = response.data.length;
            let totalFuelCosts = 0;
            for (let i = 0; i < trips; i++) {
                totalFuelCosts += response.data[i].dieselConsumption;
            }
            let totalMaintenance = 0;
            for (let i = 0; i < trips; i++) {
                totalMaintenance += response.data[i].maintenance;
            }
            setMaintenanceCosts(totalMaintenance);
            setTotalTrips(trips);
            setTotalDieselConsumption(totalFuelCosts);
            setTotalExpenses(totalFuelCosts + totalMaintenance + parseInt(ltoFees) + parseInt(fcieFees) + parseInt(miscStickerFees))
            console.log(totalExpenses)
        } catch (error) {
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    }


    //function to update yearly expense
    const handleUpdateExpense = async () => {
        try {
            const data = {
                year,
                ltoReg: ltoFees,
                fcieReg: fcieFees,
                stickerReg: miscStickerFees,
                maintenance: maintenanceCosts,
                totalTrips,
                totalDieselConsumption,
                totalExpenses
            };
            const response = await axios.put(`http://localhost:2222/yearlyexpenses/${id}`, data);
            console.log(response);
            console.log(response.data)
            alert("Yearly Expense updated.");
            window.history.back();
        } catch (error) {
            alert("Error occurred. Please check console.");
            console.error(error);
        }
    };

    return (
        <div className="p-4 mx-auto mt-4" style={{ width: '50%' }}>
            <h4>Update Yearly Expense</h4>
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
                disabled
            />
            <label>Total Trips</label>
            <input
                type="number"
                className="form-control"
                required
                value={totalTrips}
                disabled
            />
            <label>Total Diesel Consumption</label>
            <input
                type="number"
                className="form-control"
                required
                value={totalDieselConsumption}
                disabled
            />
            <label>Total Expenses</label>
            <input
                type="number"
                className="form-control"
                required
                value={totalExpenses}
                disabled
            />
            <div className="row">
                <div className="col">
                    <button className="btn btn-success mx-auto d-flex mt-4 mb-4" onClick={computeYearlyTotalTripsAndFuelCosts}>Calculate</button>
                </div>
                <div className="col">
                    <button className="btn btn-success mx-auto d-flex mt-4 mb-4" onClick={handleUpdateExpense}>Update</button>
                </div>
            </div>
        </div >
    )
}

export default EditYearlyExpense