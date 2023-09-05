import React from "react" //react allows component building
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap css framework
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
//import components
import CardComponent from "./components/card";
import Sidebar from "./components/sidebar";
import TruckTable from "./components/truckTable";
import Dashboard from "./components/dashboard";
const App = () => {
  return (
    <body>
      <div className="row" style={{ height: '500vh' }}>
        <div className="col-2">
          <Sidebar />
        </div>
        <div className="col" style={{ marginTop: '5vh', marginLeft: '50px', marginRight: '50px' }}>
          <Dashboard />
        </div>
      </div>
    </body >
  )
}
export default App
