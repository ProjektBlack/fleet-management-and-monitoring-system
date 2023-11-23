//dependencies
import React, { useEffect, useState } from "react";
import axios from 'axios'
import { SnackbarProvider, useSnackbar } from 'notistack';
import { Link } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap'
//context
import { useAuth } from "../context/authProvider";
//import components
import { Spinner, BackButton } from "./Widgets"
//icons
import { BsFillTrashFill, BsFillPencilFill, BsEye, BsCheckLg, BsExclamationCircle, BsSearch } from "react-icons/bs";

//has issues with deletion, format it to make it visually appealing
//truck table
export const TruckTable = () => {
    const { user } = useAuth();
    const [trucks, setTrucks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTruckId, setSelectedTruckId] = useState(null);
    const [criteria, setCriteria] = useState('');
    const [sort, setSort] = useState('Recent');
    //
    const [loading, setLoading] = useState(false);
    const enqueueSnackbar = useSnackbar();



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

    const handleDelete = (id) => {
        setSelectedTruckId(id);
        setShowModal(true);
    };

    //handles delete function
    const confirmDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(`http://localhost:2222/trucks/${selectedTruckId}`);
            if (response.status === 204) {
                const newTrucks = trucks.filter((truck) => truck._id !== selectedTruckId);
                setTrucks(newTrucks);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setShowModal(false);
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
                    <div className="row mb-4">
                        <div className="col-8">
                        </div>
                        <div className="col-1">
                        </div>
                        <div className="col-3">
                            <input className='form-control' placeholder="Search for plate number.." value={criteria} onChange={(e) => setCriteria(e.target.value)}></input>
                        </div>
                    </div>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "15%" }}>Plate Number</th>
                                <th style={{ width: "15%" }}>Truck Type</th>
                                <th style={{ width: "10%" }}>Availability</th>
                                <th style={{ width: "10%" }}>Maintenance</th>
                                <th >Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trucks
                                .filter(truck => truck.plateNumber.includes(criteria))
                                .map((truck) => (
                                    <tr key={truck.plateNumber}>
                                        <td>{truck.plateNumber}</td>
                                        <td>{truck.truckType}</td>
                                        <td className="text-center">{truckAvailability(truck)}</td>
                                        <td className="text-center">{truck.underMaintenance ? <BsExclamationCircle /> : <BsCheckLg />}</td>
                                        <td className="text-center">
                                            <Link className="showIcon" to={`/trucks/details/${truck._id}`} style={{ marginRight: '2%' }}><BsEye /></Link>
                                            {user.role === 'Admin' && ( //only admins can delete trucks}
                                                <BsFillTrashFill className="trashIcon" onClick={() => handleDelete(truck._id)} style={{ marginRight: '2%', cursor: "pointer" }} />
                                            )}
                                            <Link className="editIcon" to={`/trucks/edit/${truck._id}`}><BsFillPencilFill /></Link>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this truck?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

//expenses table
export const YearlyExpensesTable = () => {
    const [yearlyExpenses, setYearlyExpenses] = useState([]);
    const [plateNumber, setPlateNumber] = useState('');
    const [criteria, setCriteria] = useState('');
    const [sort, setSort] = useState('Recent');
    const [loading, setLoading] = useState(false);

    async function fetchData() {
        try {
            setLoading(true);
            const allYearlyExpenses = await axios.get("http://localhost:2222/expenses/yearly");
            for (let i = 0; i < allYearlyExpenses.data.data.length; i++) {
                const truck = await axios.get(`http://localhost:2222/trucks/${allYearlyExpenses.data.data[i].truck}`);
                console.log(truck.data.plateNumber)
                allYearlyExpenses.data.data[i].plateNumber = truck.data.plateNumber;
            }
            setYearlyExpenses(allYearlyExpenses.data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const printReport = () => {
        // Get the table element
        const table = document.getElementById("aye");

        // Create a new window
        const printWindow = window.open('', '_blank');

        // Write the table into the new window
        printWindow.document.write('<html><head><title>Print</title></head><body>');
        printWindow.document.write('<h1>My Table</h1>');
        printWindow.document.write(table.outerHTML);
        printWindow.document.write('</body></html>');

        // Call the print function on the new window
        printWindow.print();
    }

    return (
        <div>
            {loading ? (
                <div className="border d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spinner />
                </div>
            ) : (
                <div className="p-4 infoContainer rounded border-success border-start border-5">
                    <div className="row mb-4">
                        <div className="col-7">
                        </div>
                        <div className="col-2">
                            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option value="Recent">Recent</option>
                                <option value="Oldest">Oldest</option>
                            </select>
                        </div>
                        <div className="col-2">
                            <input className='form-control' placeholder="Search for anything" value={criteria} onChange={(e) => setCriteria(e.target.value)}></input>
                        </div>
                        <div className="col-1">
                            <button className="btn btn-success" onClick={printReport}>Print</button>
                        </div>
                    </div>
                    <div className="row">
                        <table id="aye" className="table table-bordered table-hover ">
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
                                {
                                    yearlyExpenses
                                        .filter(expenses => expenses.plateNumber.includes(criteria))
                                        .sort((a, b) => {
                                            if (sort === 'Recent') return b.year - a.year;
                                            if (sort === 'Oldest') return a.year - b.year;
                                            return 0;
                                        })
                                        .map((expenses) => (
                                            <tr key={expenses._id}>
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
                                        ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
            }
        </div >
    )
};

//expenses table
export const MonthlyExpensesTable = () => {
    const [monthlyExpenses, setMonthlyExpenses] = useState([]);
    const [criteria, setCriteria] = useState('');
    const [sort, setSort] = useState('Recent');
    const [loading, setLoading] = useState(false);

    async function fetchData() {
        try {
            setLoading(true);
            const allMonthlyExpenses = await axios.get("http://localhost:2222/expenses/monthly");
            for (let i = 0; i < allMonthlyExpenses.data.data.length; i++) {
                const truck = await axios.get(`http://localhost:2222/trucks/${allMonthlyExpenses.data.data[i].truck}`);
                console.log(truck.data.plateNumber)
                allMonthlyExpenses.data.data[i].plateNumber = truck.data.plateNumber;
            }
            setMonthlyExpenses(allMonthlyExpenses.data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const printReport = () => {
        // Get the table element
        const table = document.getElementById("ame");

        // Create a new window
        const printWindow = window.open('', '_blank');

        // Write the table into the new window
        printWindow.document.write('<html><head><title>Print</title></head><body>');
        printWindow.document.write('<h1>My Table</h1>');
        printWindow.document.write(table.outerHTML);
        printWindow.document.write('</body></html>');

        // Call the print function on the new window
        printWindow.print();
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
                <div className="p-4 infoContainer rounded border-success border-start border-5">
                    <div className="row mb-4">
                        <div className="col-8">
                        </div>
                        <div className="col-2">
                            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option value="Recent">Recent</option>
                                <option value="Oldest">Oldest</option>
                            </select>
                        </div>
                        <div className="col-2">
                            <input className='form-control' placeholder="Search for anything" value={criteria} onChange={(e) => setCriteria(e.target.value)}></input>
                        </div>
                    </div>
                    <div className="row">
                        <table id="ame" className="table table-bordered table-hover ">
                            <thead className="">
                                <tr className="bg-primary">
                                    <th style={{}}>Plate Number</th>
                                    <th style={{}}>Year</th>
                                    <th style={{}}>Month</th>
                                    <th style={{}}>Maintenance</th>
                                    <th style={{}}>Total Trips</th>
                                    <th style={{}}>Diesel Consumption</th>
                                    <th style={{}}>Total Monthly Expenses</th>
                                    <th style={{}}>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    monthlyExpenses
                                        .filter(expenses => expenses.plateNumber.includes(criteria))
                                        .sort((a, b) => {
                                            if (sort === 'Recent') return b.year - a.year;
                                            if (sort === 'Oldest') return a.year - b.year;
                                            return 0;
                                        })
                                        .map((expenses) => (
                                            <tr key={expenses._id}>
                                                <td>{expenses.plateNumber}</td>
                                                <td>{expenses.year}</td>
                                                <td>{expenses.month}</td>
                                                <td>{expenses.maintenance}</td>
                                                <td>{expenses.totalTrips}</td>
                                                <td>{expenses.dieselConsumption}</td>
                                                <td>{expenses.totalMonthlyExpenses}</td>
                                                <td className="text-center">
                                                    <Link id="showIcon" to={`/trucks/details/${expenses.truck}`} style={{ marginRight: '2%' }}><BsEye /></Link>
                                                </td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
            }
        </div >
    )
};

//trips table
export const TripsTable = () => {
    const [trips, setTrips] = useState([]);
    const [criteria, setCriteria] = useState('');
    const [sort, setSort] = useState('Recent');
    const [loading, setLoading] = useState(false);

    async function fetchData() {
        try {
            setLoading(true);
            const allTrips = await axios.get("http://localhost:2222/trips");
            for (let i = 0; i < allTrips.data.data.length; i++) {
                const truck = await axios.get(`http://localhost:2222/trucks/${allTrips.data.data[i].truck}`);
                console.log(truck.data.plateNumber)
                allTrips.data.data[i].plateNumber = truck.data.plateNumber;
            }
            setTrips(allTrips.data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
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
                <div className="p-4 infoContainer rounded border-success border-start border-5">
                    <div className="row mb-4">
                        <div className="col-8">
                        </div>
                        <div className="col-2">
                            <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option value="Recent">Recent</option>
                                <option value="Oldest">Oldest</option>
                            </select>
                        </div>
                        <div className="col-2">
                            <input className='form-control' placeholder="Search for anything" value={criteria} onChange={(e) => setCriteria(e.target.value)}></input>
                        </div>
                    </div>
                    <div className="row">
                        <table className="table table-bordered table-hover ">
                            <thead className="">
                                <tr className="bg-primary">
                                    <th style={{}}>Plate Number</th>
                                    <th style={{}}>Customer Name</th>
                                    <th style={{}}>Customer Location</th>
                                    <th style={{}}>Driver</th>
                                    <th style={{}}>Helper</th>
                                    <th style={{}}>Date</th>
                                    <th style={{}}>Status</th>
                                    <th style={{}}>Distance</th>
                                    <th style={{}}>Fuel Cost</th>
                                    <th style={{}}>Toll Fee</th>
                                    <th style={{}}>Pathway Fee</th>
                                    <th style={{}}>Total Expenses</th>
                                    <th style={{}}>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    trips
                                        .filter(trip => trip.plateNumber.includes(criteria))
                                        .sort((a, b) => {
                                            if (sort === 'Recent') return b.year - a.year;
                                            if (sort === 'Oldest') return a.year - b.year;
                                            return 0;
                                        })
                                        .map((trip) => (
                                            <tr key={trip._id}>
                                                <td>{trip.plateNumber}</td>
                                                <td>{trip.customer.name}</td>
                                                <td>{trip.customer.location}</td>
                                                <td>{trip.driver.name}</td>
                                                <td>{trip.helper.name}</td>
                                                <td>{trip.month} {trip.day}, {trip.year}</td>
                                                <td>{trip.status}</td>
                                                <td>{trip.distance} <span className="text-muted">km</span></td>
                                                <td>{trip.dieselConsumption}</td>
                                                <td>{trip.tollFee}</td>
                                                <td>{trip.pathway}</td>
                                                <td>{trip.totalTripExpense}</td>
                                                <td className="text-center">
                                                    <Link id="showIcon" to={`/trucks/details/${trip.truck}`} style={{ marginRight: '2%' }}><BsEye /></Link>
                                                </td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
            }
        </div >
    )
};

//truckTrips table
export const RelatedTripsTable = () => {

}