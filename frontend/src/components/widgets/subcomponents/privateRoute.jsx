import React from 'react';
import { Navigate } from 'react-router-dom';
import Home from '../../../pages/home';
const PrivateRoute = ({ isAuthenticated, children }) => {
    if (isAuthenticated) {
        return children; // Render the provided child component if the user is authenticated
    } else {
        return <Navigate to="/login" replace />;
    }
}

export default PrivateRoute;