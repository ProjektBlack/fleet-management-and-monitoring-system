import React from "react" //react allows component building
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap css framework
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Routes, Route } from 'react-router-dom'
//import components
import CardComponent from "./components/card";
import Sidebar from "./components/sidebar";
import TruckTable from "./components/truckTable";
import Dashboard from "./components/dashboard";
//import pages
import Login from "./pages/login";
const App = () => {
  return (
    <div>
      <Login />
    </div>
  )
}
export default App
