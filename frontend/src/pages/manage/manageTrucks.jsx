import React, { useEffect } from "react";
import { Link } from "react-router-dom";
//import components
import Sidebar from "../../components/widgets/subcomponents/sidebar";
import TruckTable from "../../components/tables/TruckTable";
//button icons instead of text, access controls, sort button, search bar, edit functionality
const ManageTruck = () => {
    return (
        <div>
            <div className="row">
                <div className="col-2" style={{ height: '94vh' }}>
                    <Sidebar />
                </div>
                <div className="col-10 p-4">
                    <div className="row pt-4" style={{ marginTop: '7.5vh', marginBottom: '1.5%' }}>
                        <div className="col-10 mt-4">
                            <h1>Manage Trucks</h1>
                        </div>
                        <div className="col-2 mt-4 text-end">
                            <Link to="/trucks/new" className="btn btn-success mt-2">New</Link>
                        </div>
                    </div>
                    <div className="row">
                        <TruckTable />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageTruck;
