import React from "react" //react allows component building
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap css framework
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
//import components
import CardComponent from "./components/card";
import Sidebar from "./components/sidebar";
import TruckTable from "./components/truckTable";
const App = () => {
  return (
    <body>
      <div className="row">
        <div className="col-2">
          <Sidebar />
        </div>
        <div className="col" style={{ marginTop: '25vh', marginLeft: '50px' }}>
          <TruckTable />
        </div>
      </div>
    </body >
  )
}
export default App
