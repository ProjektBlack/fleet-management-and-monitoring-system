//dependencies
import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
//import components
import { Spinner, BackButton } from "./Widgets"
//icons
import { BsFillTrashFill, BsFillPencilFill, BsEye } from "react-icons/bs";

//truck table
export const TruckTable = () => {
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(false);

    //fetches data from backend
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:2222/trucks");
            setTrucks(response.data.data);
            console.log(response.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    //handles delete function
    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const response = await axios.delete(`http://localhost:2222/trucks/${id}`);
            if (response.status === 204) {
                const newTrucks = trucks.filter((truck) => truck._id !== id);
                setTrucks(newTrucks);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    //fetches data on render and state change
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            {loading ? (
                <div className="border d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spinner />
                </div>
            ) : (
                <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "50vh" }}>
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "15%" }}>Plate Number</th>
                                <th style={{ width: "75%" }}>Truck Type</th>
                                <th style={{ width: "10%" }}>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trucks.map((truck) => (
                                <tr key={truck.plateNumber}>
                                    <td>{truck.plateNumber}</td>
                                    <td>{truck.truckType}</td>
                                    <td>
                                        <Link id="showIcon" to={`/trucks/details/${truck._id}`} style={{ marginRight: '2%' }}><BsEye /></Link>
                                        <BsFillTrashFill id="trashIcon" onClick={() => handleDelete(truck._id)} style={{ marginRight: '2%', cursor: "pointer" }} />
                                        <Link id="editIcon" to={`/trucks/edit/${truck._id}`}><BsFillPencilFill /></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

//expenses table
export const ExpensesTable = () => {

};

//trips table
export const TripsTable = () => {

};