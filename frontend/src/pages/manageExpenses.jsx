import React from "react";

//components
//need to format this properly
import Sidebar from "../components/Sidebar";
import ExpensesTable from "../components/tables/ExpensesTable"

const ManageExpenses = (props) => {
    return (
        <div>
            <div className="row">
                <div className="col-2">
                    <Sidebar />
                </div>
                <div className="col-10">
                    <div className="row d-flex mx-auto mb-4 mt-4">
                        <div className="col-9">
                            <h1 style={{ marginTop: "10%" }}>Expenses</h1>
                        </div>
                        <div className="col-1 p-4" style={{ borderStyle: 'solid', borderRadius: '5px', borderColor: '#D4D4D4', height: "75%", marginRight: "1%" }}>
                            <div className="row text-center">
                                <div className="col">
                                    {/*update using js*/}
                                    <h6 id="pendingTrips">0</h6>
                                </div>
                            </div>
                            <div className="row text-center">
                                <div className="col">
                                    <span>Pending</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-1 p-4" style={{ borderStyle: 'solid', borderRadius: '5px', borderColor: '#D4D4D4', height: "75%" }}>
                            <div className="row text-center">
                                <div className="col">
                                    {/*update using js*/}
                                    <h6 id="completedTrips">0</h6>
                                </div>
                            </div>
                            <div className="row text-center">
                                <div className="col">
                                    <span>Done</span>
                                </div>
                            </div>
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