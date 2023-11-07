import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillFileSpreadsheetFill, BsFillHouseDoorFill, BsFillTruckFrontFill, BsCreditCard2FrontFill } from "react-icons/bs";
import { useAuth } from "../../../context/authProvider";

//sidebar details should be appropriate to screen size
const Sidebar = () => {
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

export default Sidebar;