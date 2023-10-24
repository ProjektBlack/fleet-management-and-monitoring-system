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
import ManageTruck from "./pages/manage/manageTrucks";
import ManageExpenses from "./pages/manage/manageExpenses"
//import forms
import CreateTruck from "./components/forms/TruckForm"
import CreateExpense from "./components/forms/ExpensesForm";
import CreateTrip from "./components/forms/TripsForm";
//
import ShowTruck from "./pages/details/truckDetails";

const App = () => {
  return (
    <Routes>
      {/*main*/}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      {/*forms*/}
      <Route path="/newtrucks" element={<CreateTruck />} />
      <Route path="/newexpenses/:expensesId" element={<CreateExpense />} />
      <Route path="/newtrips/:truckId" element={<CreateTrip />} />
      {/*tables*/}
      <Route path="/trucks" element={<ManageTruck />} />
      <Route path="/expenses" element={<ManageExpenses />} />
      {/*details*/}
      <Route path="trucks/details/:id" element={<ShowTruck />}></Route>
    </Routes>
  )
}
export default App
