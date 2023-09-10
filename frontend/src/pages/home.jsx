import React from "react";

import Sidebar from "../components/sidebar";
import Dashboard from "../components/dashboard";

const Home = (props) => {
    return (
        <div>
            <div>
                <Sidebar />
            </div>
            <div>
                <Dashboard />
            </div>
        </div>
    );
}

export default Home;