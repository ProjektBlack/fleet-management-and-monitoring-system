import React from "react" //react allows component building
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap css framework
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route } from 'react-router-dom'
//import components
import CardComponent from "./components/widgets/Card";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CreateTruck from "./components/forms/TruckForm"
//import pages
import Test from "./pages/test";
import Login from "./pages/login";
import Home from "./pages/home";
import ManageTruck from "./pages/manageTrucks";
import ManageCustomers from "./pages/manageCustomers"
import ManageDrivers from "./pages/manageDrivers"
import ManageExpenses from "./pages/manageExpenses"
import ManageRoutes from "./pages/manageRoutes"
import ManageShipment from "./pages/manageShipments"
import ManageStocks from "./pages/manageStocks"

const App = () => {
  return (
    <Routes>
      <Route path="/testing" element={<Test />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/trucks" element={<ManageTruck />} />
      <Route path="/customers" element={<ManageCustomers />} />
      <Route path="/expenses" element={<ManageExpenses />} />
      <Route path="/stocks" element={<ManageStocks />} />
      <Route path="/drivers" element={<ManageDrivers />} />
      <Route path="/routes" element={<ManageRoutes />} />
      <Route path="/shipments" element={<ManageShipment />} />
    </Routes>
  )
}
export default App
