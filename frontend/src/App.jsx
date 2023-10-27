import React from "react" //react allows component building
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap css framework
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import PrivateRoute from "./components/widgets/subcomponents/privateRoute";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigate } from "react-router-dom";
import { useState } from 'react';
import { useAuth } from "./context/authProvider";
//import pages
import Login from "./pages/login";
import Home from "./pages/home";
import ManageTruck from "./pages/manage/manageTrucks";
import ManageExpenses from "./pages/manage/manageExpenses"
//import forms
import CreateTruck from "./components/forms/TruckForm"
import CreateExpense from "./components/forms/ExpensesForm";
import CreateTrip from "./components/forms/TripsForm";
//details
import ShowTruck from "./pages/details/truckDetails";

const App = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  return (
    <Routes>
      {/*entry point to the app*/}
      <Route path="/login" element={<Login />} />
      {/*private routes*/}
      <Route path="/home" element={<PrivateRoute isAuthenticated={isAuthenticated}><Home /></PrivateRoute>} />
      <Route path="/trucks" element={<PrivateRoute isAuthenticated={isAuthenticated}><ManageTruck /></PrivateRoute>} />
      <Route path="/newtrucks" element={<PrivateRoute isAuthenticated={isAuthenticated}><CreateTruck /></PrivateRoute>} />
      <Route path="/newexpenses/:expensesId" element={<PrivateRoute isAuthenticated={isAuthenticated}><CreateExpense /></PrivateRoute>} />
      <Route path="/newtrips/:truckId" element={<PrivateRoute isAuthenticated={isAuthenticated}><CreateTrip /></PrivateRoute>} />
      <Route path="/expenses" element={<PrivateRoute isAuthenticated={isAuthenticated}><ManageExpenses /></PrivateRoute>} />
      <Route path="trucks/details/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><ShowTruck /></PrivateRoute>} />
    </Routes>
  );
};

export default App;

