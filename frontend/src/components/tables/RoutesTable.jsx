import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
//import components
import Sidebar from "../Sidebar";
import Spinner from "../Spinner";
import { Route } from "../../../../backend/models/models";
//table's kinda squished - change layout later
//general analysis of how this works
const RoutesTable = () => {
    // rendering load states
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);

    // get data
    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:2222/route")
            .then((response) => {
                setRoutes(response.data.data);
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
                                <th>Route ID</th>
                                <th>Initial Location</th>
                                <th>Destination</th>
                                <th>Distance</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* renders the information */}
                            {routes.map((route, index) => (
                                <tr key={route.RouteID}>
                                    <td>{route.RouteID}</td>
                                    <td>{route.InitialLoc}</td>
                                    <td>{route.Destination}</td>
                                    <td>{route.Distance}</td>
                                    <td>{route.Duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RoutesTable;