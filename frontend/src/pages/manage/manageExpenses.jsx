import React from "react";
import { Link } from "react-router-dom";
//components
//need to format this properly
import Sidebar from "../../components/Sidebar";
import ExpensesTable from "../../components/tables/ExpensesTable"

const ManageExpenses = (props) => {
    return (
        <div>
            <div className="row">
                <div className="col-2">
                    <Sidebar />
                </div>
                <div className="col-10">
                    <div className="row d-flex mx-auto mb-4 mt-4">
                        <div className="col-10">
                            <h1 style={{ marginTop: "10%" }}>Expenses</h1>
                        </div>
                        <div className="col">
                            <Link to="/newexpenses" className="btn btn-outline-success" style={{ marginTop: "60%", marginLeft: "50%" }}>
                                Create
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col" >
                    <ExpensesTable />
                </div>
            </div>
        </div >
    )
}

export default ManageExpenses