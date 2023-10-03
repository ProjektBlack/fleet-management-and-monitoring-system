import React from "react";
import { Link } from "react-router-dom";
//components
import Sidebar from "../components/Sidebar";
import RoutesTable from "../components/tables/RoutesTable"
import { Route } from "react-router-dom";

const ManageRoutes = (props) => {
    return (
        <div>
            <div className="row">
                <div className="col-2">
                    <Sidebar />
                </div>
                <div className="col-10">
                    <div className="row d-flex mx-auto mb-4 mt-4">
                        <div className="col-10">
                            <h1 style={{ marginTop: "10%" }}>Routes</h1>
                        </div>
                        <div className="col">
                            <Link to="/newroute" className="btn btn-outline-success" style={{ marginTop: "60%", marginLeft: "50%" }}>
                                Create
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col" >
                    <RoutesTable />
                </div>
            </div>
        </div >
    )
}

export default ManageRoutes