import React from "react";

import Sidebar from "../components/sidebar";
import Dashboard from "../components/dashboard";

const Home = (props) => {
    return (
        <div className="row">
            <div className="col-2">
                <Sidebar />
            </div>
            <div className="col">
                <Dashboard />
            </div>
        </div >
    );
}

export default Home;