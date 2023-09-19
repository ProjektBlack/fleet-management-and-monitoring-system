import React from "react" //react allows component building
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap css framework
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route } from 'react-router-dom'
//import components
import CardComponent from "./components/Card";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CustomersTable from "./components/tables/CustomersTable";
import ExpensesTable from "./components/tables/ExpensesTable";
import StocksTable from "./components/tables/StocksTable";
import DriversTable from "./components/tables/DriversTable";
import RoutesTable from "./components/tables/RoutesTable";
import ShipmentsTable from "./components/tables/ShipmentsTable";
//import pages
import Login from "./pages/login";
import Home from "./pages/home";
import ManageTruck from "./pages/manageTrucks";
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/trucks" element={<ManageTruck />} />
      <Route path="/customers" element={<CustomersTable />} />
      <Route path="/expenses" element={<ExpensesTable />} />
      <Route path="/stocks" element={<StocksTable />} />
      <Route path="/drivers" element={<DriversTable />} />
      <Route path="/routes" element={<RoutesTable />} />
      <Route path="/shipments" element={<ShipmentsTable />} />
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
