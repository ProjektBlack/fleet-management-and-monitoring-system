import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
//import components
import Sidebar from "../Sidebar";
import Spinner from "../Spinner";
import { Customer } from "../../../../backend/models/models";

//general analysis of how this works
const CustomersTable = () => {
    // rendering load states
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    // get data
    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:2222/customer")
            .then((response) => {
                setCustomers(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }, [])
    {/*adjust spinner position*/ }
    return (
        < div >
            {
                loading ? (
                    <Spinner />
                ) : (
                    <div style={{ overflowX: "auto", marginLeft: "17%" }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Contact No.</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* renders the information */}
                                {customers.map((customer, index) => (
                                    <tr key={customer.CustomerID}>
                                        <td>{customer.CustomerID}</td>
                                        <td>{customer.CustomerFirstName}</td>
                                        <td>{customer.CustomerLastName}</td>
                                        <td>{customer.CustomerContactNo}</td>
                                        <td>{customer.CustomerEmail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div >
    );
};

export default CustomersTable;