import React from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ShowTruck = () => {
    const [trucks, setTrucks] = useState({});
    const [loading, setLoading] = useState(false)
    const { id } = useParams();
    useEffect(() => {
        setLoading(true);
        axios
            .get(`http://localhost:2222/truck/details/${id}`)
            .then((response) => {
                setTrucks(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }, [])

    return (
        <div style={{ minHeight: "100vh" }} className="d-flex justify-content-center align-items-center">
            {loading ? (
                <Spinner />
            ) : (
                <div className="card p-4" style={{ width: "25%" }} >
                    <h1>Truck No. {trucks.TruckID}</h1>
                    <h6>Plate Number</h6>
                    <p>{trucks.PlateNo}</p>
                    <h6>Type</h6>
                    <p>{trucks.TruckType}</p>
                    <h6>Revenue</h6>
                    <p>{trucks.Revenue}</p>
                    <h6>Depreciation</h6>
                    <p>{trucks.Depreciation}</p>
                    <h6>Amortization</h6>
                    <p>{trucks.Amortization}</p>
                    <h6>Total Expenses</h6>
                    <p>{trucks.TotalFeeExpenses}</p>
                    <h6>FCIE Registration</h6>
                    <p>{trucks.FCIE}</p>
                    <h6>Registration Fee</h6>
                    <p>{trucks.REGISTRATION}</p>
                </div>
            )
            }
        </div >
    )


}

export default ShowTruck