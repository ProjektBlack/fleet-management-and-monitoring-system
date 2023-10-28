import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const EditYearlyExpense = () => {
    //states for yearly expenses
    const [year, setYear] = useState("");
    const [ltoFees, setLtoFees] = useState("");
    const [fcieFees, setFcieFees] = useState("");
    const [miscStickerFees, setMiscStickerFees] = useState("");
    const [maintenanceCosts, setMaintenanceCosts] = useState("");
    //get object id from url
    const { id } = useParams();

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

    //function to update yearly expense
    const handleUpdateExpense = async () => {
        try {
            const data = {
                year,
                ltoReg: ltoFees,
                fcieReg: fcieFees,
                stickerReg: miscStickerFees,
                maintenance: maintenanceCosts
            };
            const response = await axios.put(`http://localhost:2222/yearlyexpenses/${id}`, data);
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
                <h5>Update Yearly Expense</h5>
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

export default EditYearlyExpense