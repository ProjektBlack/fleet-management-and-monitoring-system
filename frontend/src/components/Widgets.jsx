//dependencies
import React, { useEffect, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';
import axios from "axios";
//components
import { useAuth } from "../context/authProvider";
//icons
import { BsFillFileSpreadsheetFill, BsFillHouseDoorFill, BsFillTruckFrontFill, BsCreditCard2FrontFill, BsTruck, BsArrowReturnLeft } from "react-icons/bs";
//table
import { RecentTripsTable, TruckTable, TruckStatusWidget } from "./Tables";

//private route
export const PrivateRoute = ({ isAuthenticated, children }) => {
    if (isAuthenticated) {
        return children; // Render the provided child component if the user is authenticated
    } else {
        return <Navigate to="/login" replace />;
    }
}

//return button
//add an icon
export const BackButton = () => {
    const goBack = () => {
        event.preventDefault();
        window.history.back();
    };

    return (
        <button className='btn btn-secondary' onClick={goBack}>
            <BsArrowReturnLeft id="backButton" />
        </button >
    );
};

//sidebar 
//sidebar details should be appropriate to screen size
export const Sidebar = () => {
    //for logging out
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const { logout } = useAuth();
    //for navigation to login page after logging out
    const navigate = useNavigate();
    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    //logout function
    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
        enqueueSnackbar("Logged out successfully.", { variant: "default" });
        navigate("/login");
    };

    return (
        <div>
            <div id="sidebar" className="p-4">
                <div className="row border-bottom pb-2 mb-2 g-4">
                    <div className='col-2 text-center'>
                        <BsTruck className='' size={30} color='#2E8B57' />
                    </div>
                    <div className='col'>
                        <h4 className=""><span className="logo">Green </span>Movers</h4>
                    </div>
                </div>

                <div className="row">
                    <ul className="list-group">
                        <Link to={"/home"} className="links text-decoration-none"><BsFillHouseDoorFill className="icons" id='homeIcon'></BsFillHouseDoorFill>Home</Link>
                        <Link to={"/trucks"} className="links text-decoration-none"><BsFillTruckFrontFill className="icons" id="truckIcon"></BsFillTruckFrontFill>Trucks</Link>
                        <Link to={"/trips"} className="links text-decoration-none"><BsFillFileSpreadsheetFill className="icons" id="tripsIcon"></BsFillFileSpreadsheetFill>Trips</Link>
                        <button className="btn links text-decoration-none text-start" data-bs-toggle="collapse" data-bs-target="#home-collapse"><BsCreditCard2FrontFill className="icons" id="expensesIcon" />Expenses
                        </button>
                        <div className="collapse" id="home-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <Link className="link-dark rounded" to={'/expenses/yearly'}>Yearly Expenses</Link><br />
                                <Link className="link-dark rounded" to={'/expenses/monthly'}>Monthly Expenses</Link>
                            </ul>
                        </div>
                    </ul>
                </div>
                <div id="logoutSegment" className="row">
                    <div className="col">
                        <a className="text-decoration-none" id="logout" onClick={handleLogout}>Logout</a>
                    </div>
                </div>
            </div>
        </div >
    );
}

//spinner
export const Spinner = () => {
    return (
        <div class="spinner-border text-success" role="status">
            <span class="sr-only"></span>
        </div>
    )
}

//card component (placeholder)
export const CardComponent = () => {
    return (
        <div className="card mx-auto" style={{ height: '100%', width: '100%' }}>
            <div className="card-header">
                <h3>Sample</h3>
            </div>
            <div className="card-body">
                <p>This is a sample card.</p>
            </div>
        </div>
    );
}

export const PendingWidget = () => {
    const [pendingTrips, setPendingTrips] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:2222/trips/status/pending")
            .then((res) => {
                setPendingTrips(res.data.length);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className='text-center widget pt-3'>
            <div className='row'>
                <h1 id="pendingTrips" className='unlogo'>{pendingTrips}</h1>
            </div>
            <div className='row'>
                <p className='text-muted'>Pending Trips</p>
            </div>
        </div>
    );
}

export const TripsThisYear = () => {
    const [completedTrips, setCompletedTrips] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:2222/trips/status/completed")
            .then((res) => {
                setCompletedTrips(res.data.length);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className='text-center widget pt-3'>
            <div className='row'>
                <h1><span className='logo'>{completedTrips}</span></h1>
            </div>
            <div className='row'>
                <p className='text-muted'>Trips done this year</p>
            </div>
        </div>
    );
}

export const TripsThisMonth = () => {
    const [trips, setTrips] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:2222/trips/status/completed/month")
            .then((res) => {
                setTrips(res.data.length);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className='text-center widget pt-3'>
            <div className='row'>
                <h1><span className='logo'>{trips}</span></h1>
            </div>
            <div className='row'>
                <p className='text-muted'>Trips done this year</p>
            </div>
        </div>
    );
}

//dashboard
export const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="p-4">
            <div id="dashboardHeader" className='container'>
                <div className="border-start mb-4 bg-white rounded p-3 border-success border-5">
                    <h1>Dashboard</h1>
                </div>

            </div>
            {/*place widgets here*/}
            <div className='container'>
                <div className='row'>
                    <div className='col-7 col-start'>
                        <div className="row" style={{ maxHeight: "80vh" }}>
                            <RecentTripsTable />
                        </div>
                    </div>
                    <div className='col'>
                        <div className='row g-2 mb-3'>
                            <h5>Quick <span className='logo'>Glance</span></h5>
                            <div className='col'>
                                <div id="pendingContainer" className='rounded'>
                                    <PendingWidget />
                                </div>
                            </div>
                            <div className='col'>
                                <div className='infoContainer rounded'>
                                    <TripsThisMonth />
                                </div>
                            </div>
                            <div className='col'>
                                <div className='infoContainer rounded'>
                                    <TripsThisYear />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <div className='infoContainer'>
                                    <TruckStatusWidget />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

