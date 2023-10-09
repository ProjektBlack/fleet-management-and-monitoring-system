import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Spinner from "../Spinner";

const TruckTable = () => {
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:2222/trucks")
            .then((response) => {
                setTrucks(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }, []);

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <div style={{ overflowX: "auto", marginLeft: "18%", overflowY: "auto", maxHeight: "50vh", maxWidth: "80%" }}>
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "25%" }}>ID</th>
                                <th style={{ width: "25%" }}>Plate Number</th>
                                <th style={{ width: "25%" }}>Truck Type</th>
                                <th style={{ width: "25%" }}>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trucks.map((truck, index) => (
                                <tr key={truck._id}>
                                    <td>{truck._id}</td>
                                    <td>{truck.plateNumber}</td>
                                    <td>{truck.truckType}</td>
                                    <td>
                                        <Link to={`/trucks/details/${truck._id}`}>Show</Link>
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
