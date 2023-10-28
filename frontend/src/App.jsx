import React from "react" //react allows component building
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap css framework
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import PrivateRoute from "./components/widgets/subcomponents/privateRoute";
import { Routes, Route } from 'react-router-dom'
import { useAuth } from "./context/authProvider";
//import pages
import Login from "./pages/login";
import Home from "./pages/home";
import ManageTruck from "./pages/manage/manageTrucks";
import ManageExpenses from "./pages/manage/manageExpenses"
import Missing from "./pages/missing";
//import forms
import CreateTruck from "./components/forms/TruckForm"
import CreateExpense from "./components/forms/ExpensesForm";
import CreateTrip from "./components/forms/TripsForm";
import EditTruck from "./components/forms/EditTrucks";
import EditYearlyExpense from "./components/forms/EditYearlyExpense";
import EditMonthlyExpense from "./components/forms/EditMonthlyExpense";
import EditTrip from "./components/forms/EditTrips";
//details
import ShowTruck from "./pages/details/truckDetails";

const App = () => {
  //get the authentication state from the context
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  return (
    <Routes>
      {/*entry point to the app*/}
      <Route path="/login" element={<Login />} />
      {/*private routes*/}
      <Route path="/home" element={<PrivateRoute isAuthenticated={isAuthenticated}><Home /></PrivateRoute>} />
      <Route path="/trucks" element={<PrivateRoute isAuthenticated={isAuthenticated}><ManageTruck /></PrivateRoute>} />
      <Route path="/trucks/new" element={<PrivateRoute isAuthenticated={isAuthenticated}><CreateTruck /></PrivateRoute>} />
      <Route path="/trucks/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><EditTruck /></PrivateRoute>} />
      <Route path="/newexpenses/:expensesId" element={<PrivateRoute isAuthenticated={isAuthenticated}><CreateExpense /></PrivateRoute>} />
      <Route path="/expenses/yearly/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><EditYearlyExpense /></PrivateRoute>} />
      <Route path="/expenses/monthly/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><EditMonthlyExpense /></PrivateRoute>} />
      <Route path="/newtrips/:truckId" element={<PrivateRoute isAuthenticated={isAuthenticated}><CreateTrip /></PrivateRoute>} />
      <Route path="/trips/edit/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><EditTrip /></PrivateRoute>} />
      <Route path="/expenses" element={<PrivateRoute isAuthenticated={isAuthenticated}><ManageExpenses /></PrivateRoute>} />
      <Route path="trucks/details/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><ShowTruck /></PrivateRoute>} />
      {/*error page*/}
      <Route path="*" element={<Missing />} />
    </Routes>
  );
};

export default App;

