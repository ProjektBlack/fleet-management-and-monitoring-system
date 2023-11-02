import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
import Sidebar from "../widgets/subcomponents/Sidebar";
import Spinner from "../widgets/subcomponents/Spinner";

const TruckTable = (props) => {
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(false);

    //fetches data from backend
    const fetchData = async () => {
        setLoading(true);
        console.log(props.isAuthenticated);

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
                                <th style={{ width: "20%" }}>Plate Number</th>
                                <th style={{ width: "60%" }}>Truck Type</th>
                                <th style={{ width: "20%" }}>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trucks.map((truck) => (
                                <tr key={truck.plateNumber}>
                                    <td>{truck.plateNumber}</td>
                                    <td>{truck.truckType}</td>
                                    <td>
                                        <Link className="btn btn-outline-success" to={`/trucks/details/${truck._id}`} style={{ marginRight: '2%' }}>Show</Link>
                                        <button className="btn btn-outline-danger" onClick={() => handleDelete(truck._id)} style={{ marginRight: '2%' }}>Delete</button>
                                        <Link className="btn btn-outline-warning" to={`/trucks/edit/${truck._id}`}>Edit</Link>
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

export default TruckTable;
