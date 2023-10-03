import React from "react" //react allows component building
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap css framework
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route } from 'react-router-dom'
//import components
import CardComponent from "./components/widgets/Card";
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
//import forms
import CreateTruck from "./components/forms/TruckForm"
import CreateStock from "./components/forms/StockForm"
import CreateShipment from "./components/forms/ShipmentForm"
import CreateRoute from "./components/forms/RoutesForm"
import CreateDriver from "./components/forms/DriversForm"
import CreateCustomer from "./components/forms/CustomersForm"
import CreateExpense from "./components/forms/ExpensesForm";

const App = () => {
  return (
    <Routes>
      {/*main*/}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      {/*forms*/}
      <Route path="/newtruck" element={<CreateTruck />} />
      <Route path="/newcustomer" element={<CreateCustomer />} />
      <Route path="/newdriver" element={<CreateDriver />} />
      <Route path="/newexpenses" element={<CreateExpense />} />
      <Route path="/newroute" element={<CreateRoute />} />
      <Route path="/newshipment" element={<CreateShipment />} />
      <Route path="/newstock" element={<CreateStock />} />
      {/*tables*/}
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
