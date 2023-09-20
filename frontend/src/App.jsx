import React from "react" //react allows component building
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap css framework
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route } from 'react-router-dom'
//import components
import CardComponent from "./components/Card";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
//import pages
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
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/trucks" element={<ManageTruck />} />
      <Route path="/customers" element={<ManageCustomers />} />
      <Route path="/expenses" element={<ManageExpenses />} />
      <Route path="/stocks" element={<ManageStocks />} />
      <Route path="/drivers" element={<ManageDrivers />} />
      <Route path="/routes" element={<ManageRoutes />} />
      <Route path="/shipments" element={<ManageShipment />} />
      {/*
      to be added - just remove the comment after assembling the pages
      <Route path="/trucks" element={ } />
      <Route path="/trucks" element={ } />
      <Route path="/trucks" element={ } />
      */}
    </Routes>
  )
}
export default App
