import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
            <div id="sidebar" className="container p-4 bg-success text-white" style={{ height: "100vh" }}>
                <div className="row">
                    <h2 className="">FMMS</h2>
                </div>
                <div className="row">
                    <ul>
                        <li className="list-group-item">Home</li>
                        <li className="list-group-item">Trucks</li>
                        <li className="list-group-item">Trips</li>
                        <li className="list-group-item">Expenses</li>
                    </ul>

                </div>
            </div>


        </div >
    );
}

export default Sidebar;