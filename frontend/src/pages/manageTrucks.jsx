import React from "react";

//import components
import Sidebar from "../components/Sidebar";
import TruckTable from "../components/tables/TruckTable";

const ManageTruck = (props) => {
    return (
        <div className="row">
            <div className="col-2">
                <Sidebar />
            </div>
            <div className="col">
                <TruckTable />
            </div>
        </div>
    )
}

export default ManageTruck;
