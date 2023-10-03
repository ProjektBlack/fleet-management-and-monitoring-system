import React from "react";
import { Link } from "react-router-dom";
//components
import Sidebar from "../components/Sidebar";
import DriversTable from "../components/tables/DriversTable"

const ManageDrivers = (props) => {
    return (
        <div>
            <div className="row">
                <div className="col-2">
                    <Sidebar />
                </div>
                <div className="col-10">
                    <div className="row d-flex mx-auto mb-4 mt-4">
                        <div className="col-10">
                            <h1 style={{ marginTop: "10%" }}>Drivers</h1>
                        </div>
                        <div className="col">
                            <Link to="/newdriver" className="btn btn-outline-success" style={{ marginTop: "60%", marginLeft: "50%" }}>
                                Create
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col" >
                    <DriversTable />
                </div>
            </div>
        </div >
    )
}

export default ManageDrivers