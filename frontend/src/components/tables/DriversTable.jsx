import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
//import components
import Sidebar from "../Sidebar";
import Spinner from "../Spinner";
import { Driver } from "../../../../backend/models/models";
//table's kinda squished - change layout later
//general analysis of how this works
const DriversTable = () => {
    // rendering load states
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);

    // get data
    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:2222/driver")
            .then((response) => {
                setDrivers(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }, [])

    return (
        <div>
            {loading ? (
                <Spinner />
            ) : (
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Driver ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Contact No.</th>
                                <th>License No.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* renders the information */}
                            {drivers.map((driver, index) => (
                                <tr key={driver.DriverID}>
                                    <td>{driver.DriverID}</td>
                                    <td>{driver.DriverFirstName}</td>
                                    <td>{driver.DriverLastName}</td>
                                    <td>{driver.DriverContactNo}</td>
                                    <td>{driver.DriverLicenseNo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DriversTable;