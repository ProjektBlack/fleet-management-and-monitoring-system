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
import { BsFillTrashFill, BsFillPencilFill, BsEye, BsCheckLg, BsExclamationCircle, BsPrinter, BsPlusCircleFill } from "react-icons/bs";

//has issues with deletion, format it to make it visually appealing
//truck table
export const TruckTable = () => {
    //states
    const [loading, setLoading] = useState(false);
    const [trucks, setTrucks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTruckId, setSelectedTruckId] = useState(null);
    const [criteria, setCriteria] = useState('');
    //functions from context
    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    //fetches data from backend
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:2222/trucks");
            const trucks = response.data.data;

            const trucksWithTrips = await Promise.all(trucks.map(async (truck) => {
                const trips = await Promise.all(truck.trips.map(fetchTripData));
                return { ...truck, trips };
            }));
            setTrucks(trucksWithTrips);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
            enqueueSnackbar("Failed to fetch data.", { variant: 'error' });
        }
    };

    //fetch trip data - crucial for truckAvailability function
    const fetchTripData = async (tripId) => {
        try {
            const response = await axios.get(`http://localhost:2222/trips/${tripId}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    //check if truck object has pending trips or is under maintenance
    const truckAvailability = (truck) => {
        const hasPendingTrips = truck.trips.some(trip => trip.status === 'pending' || trip.status === 'Pending');
        const isUnderMaintenance = truck.underMaintenance;

        if (hasPendingTrips || isUnderMaintenance) {
            return 'Unavailable';
        } else {
            return 'Available';
        }
    };

    //shows the confirmation modal
    const handleDelete = (id) => {
        setSelectedTruckId(id);
        setShowModal(true);
    };

    //handles delete function
    const confirmDelete = async () => {
        setLoading(true);
        try {
            const response = await axios.delete(`http://localhost:2222/trucks/${selectedTruckId}`);
            enqueueSnackbar('Truck deleted successfully.', { variant: 'success' });
            if (response.status === 204) {
                const newTrucks = trucks.filter((truck) => truck._id !== selectedTruckId);
                setTrucks(newTrucks);
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Process failed.', { variant: 'error' });
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
                <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                    <Spinner />
                </div>
            ) : (
                <div className="p-4" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "70vh" }}>
                    <div className="row mb-4">
                        <div className="col-8">
                        </div>
                        <div className="col-3">
                            <input className='form-control' placeholder="Search for plate number.." value={criteria} onChange={(e) => setCriteria(e.target.value)}></input>
                        </div>
                        <div className="col-1">
                            <Link to="/trucks/new" title="Create new truck"><BsPlusCircleFill id="newIcon" size={35} /></Link>
                        </div>

                    </div>
                    <div className="row">
                        <table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th className="text-center" scope="row">Plate Number</th>
                                    <th className="text-center">Truck Type</th>
                                    <th className="text-center">Availability</th>
                                    <th className="text-center">Maintenance</th>
                                    <th className="text-center">Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trucks
                                    .filter(truck => truck.plateNumber.includes(criteria))
                                    .map((truck) => (
                                        <tr key={truck.plateNumber}>
                                            <td className="text-center" scope="row">{truck.plateNumber}</td>
                                            <td className="text-center">{truck.truckType}</td>
                                            <td className="text-center" style={{ color: truckAvailability(truck) === 'Available' ? 'green' : 'red' }}>{truckAvailability(truck)}</td>
                                            <td className="text-center" style={{ color: truck.underMaintenance ? 'red' : 'green' }}>{truck.underMaintenance ? <BsExclamationCircle /> : <BsCheckLg />}</td>
                                            <td className="text-center">
                                                <Link title="Show all related information" className="showIcon" to={`/trucks/details/${truck._id}`} style={{ marginRight: '2%' }}><BsEye /></Link>
                                                {user.role === 'Admin' && ( //only admins can delete trucks}
                                                    <BsFillTrashFill title="Delete this truck" className="trashIcon" onClick={() => handleDelete(truck._id)} style={{ marginRight: '2%', cursor: "pointer" }} />
                                                )}
                                                <Link title="Edit this truck" className="editIcon" to={`/trucks/edit/${truck._id}`}><BsFillPencilFill /></Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="gmsModal">
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
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [criteria, setCriteria] = useState('');
    const [sort, setSort] = useState('Recent');
    const [loading, setLoading] = useState(false);

    async function fetchData() {
        try {
            setLoading(true);
            const allYearlyExpenses = await axios.get("http://localhost:2222/expenses/yearly");
            let calculatedTotalExpenses = 0;
            for (let i = 0; i < allYearlyExpenses.data.data.length; i++) {
                const truck = await axios.get(`http://localhost:2222/trucks/${allYearlyExpenses.data.data[i].truck}`);
                console.log(truck.data.plateNumber)
                allYearlyExpenses.data.data[i].plateNumber = truck.data.plateNumber;
                calculatedTotalExpenses += allYearlyExpenses.data.data[i].totalExpenses;
            }
            setYearlyExpenses(allYearlyExpenses.data.data);
            setTotalExpenses(calculatedTotalExpenses);
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
        const table1 = document.getElementById("aye");
        const table2 = document.getElementById("hm");

        // Create a new window
        const printWindow = window.open('', '_blank');

        // Write the table into the new window
        printWindow.document.write('<html><head><title>Yearly Expense Report</title></head><body>');
        printWindow.document.write('<h1>Yearly Expense Report</h1>');
        printWindow.document.write(table1.outerHTML);
        printWindow.document.write('<hr>');
        printWindow.document.write(table2.outerHTML);
        printWindow.document.write('</body></html>');

        // Call the print function on the new window
        printWindow.print();
    }

    return (
        <div>
            {loading ? (
                <div className="border d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                    <Spinner />
                </div>
            ) : (
                <div className="p-4 infoContainer rounded border-success border-start border-5" style={{ height: '70vh' }}>
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
                            <button title="Generate report" className="btn btn-success" onClick={printReport}><BsPrinter size={20} /></button>
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
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                        <table className="table table-bordered" id="hm">
                            <thead>
                                <tr>
                                    <th className="text-end">Total Expenses: <span className="text-muted">{totalExpenses}</span></th>
                                </tr>
                            </thead>
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
                <div className="border d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                    <Spinner />
                </div>
            ) : (
                <div className="p-4 infoContainer rounded border-success border-start border-5" style={{ height: '70vh' }}>
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

//recent trips table
export const RecentTripsTable = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);

    async function fetchData() {
        try {
            setLoading(true);
            const allTrips = await axios.get("http://localhost:2222/trips");
            for (let i = 0; i < allTrips.data.data.length; i++) {
                const truck = await axios.get(`http://localhost:2222/trucks/${allTrips.data.data[i].truck}`);
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
                <div className="border d-flex justify-content-center align-items-center infoContainer" style={{ height: '50vh' }}>
                    <Spinner />
                </div>
            ) : (
                <div className="p-4 infoContainer rounded border-start border-success border-5" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "50vh" }}>
                    <div className="row">
                        <h4>Recent <span className="logo">Trips</span></h4>
                        <table className="table table-hover table-small" >
                            <thead className="">
                                <tr className="bg-primary">
                                    <th className="text-center">Plate Number</th>
                                    <th className="text-center">Customer Name</th>
                                    <th className="text-center">Customer Location</th>
                                    <th className="text-center">Date</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Distance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    trips
                                        .sort((a, b) => {
                                            const months = {
                                                January: 1,
                                                February: 2,
                                                March: 3,
                                                April: 4,
                                                May: 5,
                                                June: 6,
                                                July: 7,
                                                August: 8,
                                                September: 9,
                                                October: 10,
                                                November: 11,
                                                December: 12,
                                            };
                                            const dateA = new Date(`${a.year}-${months[a.month]}-${a.day}`);
                                            const dateB = new Date(`${b.year}-${months[b.month]}-${b.day}`);

                                            return dateB - dateA;
                                        })
                                        .map((trip) => (
                                            <tr key={trip._id}>
                                                <td className="text-center">{trip.plateNumber}</td>
                                                <td className="text-center">{trip.customer.name}</td>
                                                <td className="text-center">{trip.customer.location}</td>
                                                <td className="text-center">{trip.month} {trip.day}, {trip.year}</td>
                                                <td style={{ color: trip.status === 'Pending' ? 'orange' : 'green' }} className="text-center">{trip.status}</td>
                                                <td className="text-center">{trip.distance} <span className="text-muted">km</span></td>
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
}

//display table
export const TruckStatusWidget = () => {
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(false);
    //functions
    const { enqueueSnackbar } = useSnackbar();

    //fetches data from backend
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:2222/trucks");
            const trucks = response.data.data;

            const trucksWithTrips = await Promise.all(trucks.map(async (truck) => {
                const trips = await Promise.all(truck.trips.map(fetchTripData));
                return { ...truck, trips };
            }));
            setTrucks(trucksWithTrips);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
            enqueueSnackbar("Failed to fetch data.", { variant: 'error' });
        }
    };

    //fetch trip data - crucial for truckAvailability function
    const fetchTripData = async (tripId) => {
        try {
            const response = await axios.get(`http://localhost:2222/trips/${tripId}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    //check if truck object has pending trips or is under maintenance
    const truckAvailability = (truck) => {
        const hasPendingTrips = truck.trips.some(trip => trip.status === 'pending' || trip.status === 'Pending');
        const isUnderMaintenance = truck.underMaintenance;

        if (hasPendingTrips || isUnderMaintenance) {
            return 'Unavailable';
        } else {
            return 'Available';
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div>
            {loading ? (
                <div className=" d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spinner />
                </div>
            ) : (
                <div className="p-4 rounded border-start border-success border-5" style={{ overflowX: "auto", overflowY: "auto", maxHeight: "50vh" }}>
                    <h4>Truck <span className="logo">Status</span></h4>
                    <table className="table table-hover table-sm">
                        <thead>
                            <tr>
                                <th style={{ width: "75%" }}>Plate Number</th>
                                <th className="text-center" style={{ width: "33%" }}>Availability</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trucks
                                .map((truck) => (
                                    <tr key={truck.plateNumber}>
                                        <td>{truck.plateNumber}</td>
                                        <td className="text-center" style={{ color: truckAvailability(truck) === 'Available' ? 'green' : 'red' }}>{truckAvailability(truck)}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}