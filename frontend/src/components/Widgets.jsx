//dependencies
import React, { useEffect, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import axios from "axios";
//components
import { useAuth } from "../../../context/authProvider";
//icons
import { BsFillFileSpreadsheetFill, BsFillHouseDoorFill, BsFillTruckFrontFill, BsCreditCard2FrontFill } from "react-icons/bs";

//private route
export const PrivateRoute = ({ isAuthenticated, children }) => {
    if (isAuthenticated) {
        return children; // Render the provided child component if the user is authenticated
    } else {
        return <Navigate to="/login" replace />;
    }
}

//return button
export const BackButton = () => {
    const goBack = () => {
        window.history.back();
    };

    return (
        <button className="btn btn-outline-success" onClick={goBack}>Return</button>
    );
};

//sidebar 
//sidebar details should be appropriate to screen size
export const Sidebar = () => {
    //for logging out
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    //for navigation to login page after logging out
    const navigate = useNavigate();

    //logout function
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate("/login");
    };

    return (
        <div>
            <div id="sidebar" className="border-right p-4">
                <div className="row border-bottom pb-2 mb-2">
                    <div className="col">
                        <h4 className=""><span className="logo">Green Movers</span> Services</h4>
                    </div>
                </div>
                <div className="row">
                    <ul className="list-group">
                        <Link to={"/home"} className="links text-decoration-none"><BsFillHouseDoorFill className="icons"></BsFillHouseDoorFill>  Home</Link>
                        <Link to={"/trucks"} className="links text-decoration-none"><BsFillTruckFrontFill className="icons" id="truckIcon"></BsFillTruckFrontFill>Trucks</Link>
                        <Link to={"/trips"} className="links text-decoration-none"><BsFillFileSpreadsheetFill className="icons" id="tripsIcon"></BsFillFileSpreadsheetFill>Trips</Link>
                        <Link to={"/expenses"} className="links text-decoration-none"><BsCreditCard2FrontFill className="icons" id="expensesIcon"></BsCreditCard2FrontFill>Expenses</Link>
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
        <div className="spinner-border text-success" role="status">
            <span className="sr-only"></span>
        </div>
    )
}

//pending widget
const PendingWidget = () => {
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
        <div id="pendingWidget" className="col-2">
            <div className="row text-center">
                <div className="col">
                    <BsFillTruckFrontFill />
                    <h6 id="pendingTrips">{pendingTrips}</h6>
                    <h6>Pending Trips</h6>
                </div>
            </div>
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

//dashboard
export const Dashboard = () => {
    return (
        //notifications
        //update using js, also, insert icons
        //update to compartmentalize css
        <div className="p-4">
            <div className="row border-bottom pb-3 mb-4">
                <div className="col-9" style={{ marginRight: '5%' }}>
                    <h1 style={{ marginTop: '5%' }}>Dashboard</h1>
                </div>
                <PendingWidget />
            </div>
            {/*place widgets here*/}
            <div id="widgets">
                {/*sample widgets*/}
                <div className="row mb-4">
                    <div className="col-8">
                        <TruckTable />
                    </div>
                    <div className="col">
                        <div className="row mb-4">
                            <CardComponent />
                        </div>
                        <div className="row">
                            <CardComponent />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col" style={{ marginRight: '1%' }}>
                        <div className="row-1" style={{ height: '25vh' }}>
                            <CardComponent />
                        </div>

                    </div>
                    <div className="col-7">
                        <div className="row" style={{ height: '25vh' }}>
                            <CardComponent />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}