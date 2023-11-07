import React, { useEffect, useState } from "react";
import CardComponent from "../Card";
import PendingWidget from "../Pending";
import TruckTable from "../../tables/TruckTable";

//first complex component
const Dashboard = (props) => {
    return (
        //notifications
        //update using js, also, insert icons
        //update to compartmentalize css
        <div className="p-4">
            <div className="row border-bottom pb-3 mb-4">
                <div className="col-9" style={{ marginRight: '5%' }}>
                    <h1 style={{ marginTop: '5%' }}>Dashboard</h1>
                </div>
                <PendingWidget />
            </div>
            {/*place widgets here*/}
            <div id="widgets">
                {/*sample widgets*/}
                <div className="row mb-4">
                    <div className="col-8">
                        <TruckTable />
                    </div>
                    <div className="col">
                        <div className="row mb-4">
                            <CardComponent />
                        </div>
                        <div className="row">
                            <CardComponent />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col" style={{ marginRight: '1%' }}>
                        <div className="row-1" style={{ height: '25vh' }}>
                            <CardComponent />
                        </div>

                    </div>
                    <div className="col-7">
                        <div className="row" style={{ height: '25vh' }}>
                            <CardComponent />
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default Dashboard;