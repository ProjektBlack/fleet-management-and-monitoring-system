import React from "react";
import { Link } from "react-router-dom";
//import components
import Sidebar from "../components/Sidebar";
import TruckTable from "../components/tables/TruckTable";
//add new buttons, edit button perhaps, access controls, general layout optimization
//correct loading animation
const ManageTruck = () => {
    return (
        <div>
            <div className="row">
                <div className="col-2">
                    <Sidebar />
                </div>
                <div className="col-10">
                    <div className="row d-flex mx-auto mb-4 mt-4">
                        <div className="col-10">
                            <h1 style={{ marginTop: "10%" }}>Trucks</h1>
                        </div>
                        <div className="col">
                            <Link to="/newtruck" className="btn btn-outline-success" style={{ marginTop: "60%", marginLeft: "50%" }}>
                                Create
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col" >
                    <TruckTable />
                </div>
            </div>
        </div >

    )
}

export default ManageTruck;
