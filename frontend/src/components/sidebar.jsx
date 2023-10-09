import React from "react";
import { Link } from "react-router-dom";
//user icon or name should change depending on the user
//sidebar should shrink when screen is small
const Sidebar = (props) => {
    return (
        <div className="flex-shrink-0 p-3 bg-white" style={{ width: '250px', height: '100vh', boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", position: 'fixed' }}>
            <a href="/" className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
                <span className="fs-5 fw-semibold"><span style={{ color: "green" }}>Green Movers</span> Services</span>
            </a>
            <ul className="list-unstyled ps-0">
                <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded" aria-expanded="true">
                        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                            Dashboard
                        </Link>
                    </button>
                </li>
                <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
                        Manage
                    </button>
                    <div className="collapse" id="dashboard-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><Link to="/trucks" className="link-dark rounded">Trucks</Link></li>
                            <li><Link to="/drivers" className="link-dark rounded">Drivers</Link></li>
                            <li><Link to="/customers" className="link-dark rounded">Customers</Link></li>
                            <li><Link to="/expenses" className="link-dark rounded">Expenses</Link></li>
                            <li><Link to="/stocks" className="link-dark rounded">Stocks</Link></li>
                            <li><Link to="/routes" className="link-dark rounded">Routes</Link></li>
                            <li><Link to="/shipments" className="link-dark rounded">Shipments</Link></li>
                        </ul>
                    </div>
                </li>
                <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="false">
                        Calculator
                    </button>
                    <div className="collapse" id="orders-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" className="link-dark rounded">Fuel</a></li>
                            <li><a href="#" className="link-dark rounded">Tentative</a></li>
                            <li><a href="#" className="link-dark rounded">Tentative</a></li>
                            <li><a href="#" className="link-dark rounded">Tentative</a></li>
                        </ul>
                    </div>
                </li>
                <li className="border-top my-3"></li>
                <li style={{ marginTop: '190%' }}>
                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#account-collapse" aria-expanded="false">
                        Account
                    </button>
                    <div className="collapse" id="account-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="#" className="link-dark rounded">Settings</a></li>
                            <li><a href="#" className="link-dark rounded">Log Out</a></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div >
    );
}

export default Sidebar;