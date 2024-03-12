import React from "react"; //react allows component building
import "bootstrap/dist/css/bootstrap.min.css"; //bootstrap css framework
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Routes, Route } from "react-router-dom";
//import contexts
import { useAuth } from "./context/authProvider";
//import pages
import {
  Home,
  Login,
  Missing,
  ManageTruck,
  ManageYearlyExpenses,
  ManageMonthlyExpenses,
  ShowTruck,
  ManageTrips,
} from "./components/Pages";
//import forms
import {
  CreateTruck,
  CreateTrip,
  CreateExpense,
  EditTruck,
  EditMonthlyExpense,
  EditYearlyExpense,
  EditTrip,
  Register,
} from "./components/Forms";
//import private route
import { PrivateRoute } from "./components/Widgets";
const App = () => {
  //get the authentication state from the context
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  return (
    <Routes>
      {/*entry point to the app*/}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/*private routes*/}
      <Route
        path="/home"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/trucks"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <ManageTruck />
          </PrivateRoute>
        }
      />
      <Route
        path="/trucks/new"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <CreateTruck />
          </PrivateRoute>
        }
      />
      <Route
        path="/trucks/edit/:id"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <EditTruck />
          </PrivateRoute>
        }
      />
      <Route
        path="/expenses/new/:truckId"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <CreateExpense />
          </PrivateRoute>
        }
      />
      <Route
        path="/expenses/yearly/edit/:id/"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <EditYearlyExpense />
          </PrivateRoute>
        }
      />
      <Route
        path="/expenses/monthly/edit/:id/"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <EditMonthlyExpense />
          </PrivateRoute>
        }
      />
      <Route
        path="/newtrips/:truckId"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <CreateTrip />
          </PrivateRoute>
        }
      />
      <Route
        path="/trips/edit/:id"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <EditTrip />
          </PrivateRoute>
        }
      />
      <Route
        path="/expenses/monthly"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <ManageMonthlyExpenses />
          </PrivateRoute>
        }
      />
      <Route
        path="/expenses/yearly"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <ManageYearlyExpenses />
          </PrivateRoute>
        }
      />
      <Route
        path="/trips"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <ManageTrips />
          </PrivateRoute>
        }
      />
      <Route
        path="/trucks/details/:id"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <ShowTruck />
          </PrivateRoute>
        }
       
      />
      {/*error page*/}
      <Route path="*" element={<Missing />} />
    </Routes>
  );
};

export default App;
