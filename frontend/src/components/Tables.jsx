//dependencies
import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
//import components
import { Spinner, BackButton } from "./Widgets"
//icons
import { BsFillTrashFill, BsFillPencilFill, BsEye, BsCheckLg, BsExclamationCircle } from "react-icons/bs";


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

    const truckAvailability = (truck) => {
        const hasPendingTrips = truck.trips.some(trip => trip.status === 'pending' || trip.status === 'Pending');
        const isUnderMaintenance = truck.underMaintenance;

        if (hasPendingTrips || isUnderMaintenance) {
            return 'Unavailable';
        } else {
            return 'Available';
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
                <div className="s d-flex justify-content-center align-items-center" style={{ height: '40vh' }}>
                    <Spinner />
                </div>
            ) : (
                <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "70vh" }}>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Plate Number</th>
                                <th>Truck Type</th>
                                <th>Availability</th>
                                <th>Maintenance</th>
                                <th>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trucks.map((truck) => (
                                <tr key={truck.plateNumber}>
                                    <td>{truck.plateNumber}</td>
                                    <td>{truck.truckType}</td>
                                    <td>{truckAvailability(truck)}</td>
                                    <td>{truck.underMaintenance ? <BsExclamationCircle /> : <BsCheckLg />}</td>
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
export const YearlyExpensesTable = () => {
    const [yearlyExpenses, setYearlyExpenses] = useState([]);
    const [loading, setLoading] = useState(false);

    async function fetchData() {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:2222/yearlyexpenses");
            const expenses = await Promise.all(response.data.data.map(async (expense) => {
                const truckResponse = await axios.get(`http://localhost:2222/trucks/${expense.truck}`);
                return { ...expense, plateNumber: truckResponse.data.plateNumber };
            }));
            setYearlyExpenses(expenses);
            setLoading(false);
        } catch {
            setLoading(false);
            console.log("Error");
        }
    }

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
                <div className="" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "50vh", marginRight: "2%" }}>
                    <table className="table table-bordered table-hover ">
                        <thead className="">
                            <tr className="bg-primary">
                                <th style={{}}>Plate Number</th>
                                <th style={{}}>Year</th>
                                <th style={{}}>LTO Fees</th>
                                <th style={{}}>FCIE Fees</th>
                                <th style={{}}>Misc. Sticker Fees</th>
                                <th style={{}}>Maintenance</th>
                                <th style={{}}>Total Trips</th>
                                <th style={{}}>Total Diesel Consumption</th>
                                <th style={{}}>Total Expenses</th>
                                <th style={{}}>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {yearlyExpenses.map((expenses) => (
                                <tr key={expenses.plateNumber}>
                                    <td>{expenses.plateNumber}</td>
                                    <td>{expenses.year}</td>
                                    <td>{expenses.ltoReg}</td>
                                    <td>{expenses.fcieReg}</td>
                                    <td>{expenses.stickerReg}</td>
                                    <td>{expenses.maintenance}</td>
                                    <td>{expenses.totalTrips}</td>
                                    <td>{expenses.totalDieselConsumption}</td>
                                    <td>{expenses.totalExpenses}</td>
                                    <td className="text-center">
                                        <Link id="showIcon" to={`/trucks/details/${expenses.truck}`} style={{ marginRight: '2%' }}><BsEye /></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
};


//trips table
export const TripsTable = () => {

};