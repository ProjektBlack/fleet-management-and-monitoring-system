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
//import forms
import CreateTruck from "./components/forms/TruckForm"
import CreateDriver from "./components/forms/DriversForm"
import CreateCustomer from "./components/forms/CustomersForm"
import CreateExpense from "./components/forms/ExpensesForm";
//
import ShowTruck from "./pages/truckDetails";

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
      {/*tables*/}
      <Route path="/trucks" element={<ManageTruck />} />
      <Route path="/customers" element={<ManageCustomers />} />
      <Route path="/expenses" element={<ManageExpenses />} />
      <Route path="/drivers" element={<ManageDrivers />} />
      {/*details*/}
      <Route path="trucks/details/:id" element={<ShowTruck />}></Route>
    </Routes>
  )
}
export default App
