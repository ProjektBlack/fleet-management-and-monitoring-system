import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
//no loading animation
const ManageTruck = () => {
    //rendering load states
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
    }, [])
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Plate Number</th>
                        <th>Truck Type</th>
                        <th>Revenue</th>
                        <th>Depreciation</th>
                        <th>Amortization</th>
                        <th>Total Fee Expenses</th>
                        <th>FCIE Registration</th>
                        <th>Misc. Registration</th>
                    </tr>
                </thead>
                <tbody>
                    {/*renders the information*/}
                    {trucks.map((truck, index) => (
                        <tr key={truck.TruckID}>
                            <td>
                                {truck.TruckID}
                            </td>
                            <td>
                                {truck.PlateNo}
                            </td>
                            <td>
                                {truck.TruckType}
                            </td>
                            <td>
                                {truck.Revenue}
                            </td>
                            <td>
                                {truck.Depreciation}
                            </td>
                            <td>
                                {truck.Amortization}
                            </td>
                            <td>
                                {truck.TotalFeeExpenses}
                            </td>
                            <td>
                                {truck.FCIE}
                            </td>
                            <td>
                                {truck.REGISTRATION}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageTruck;