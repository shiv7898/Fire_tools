import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, userData }) => {
    const location = useLocation();

    // If userData is provided, use it. Otherwise, check localStorage as a fallback 
    // (though App.js usually handles the source of truth)
    const isAuthenticated = userData || localStorage.getItem("userData");

    if (!isAuthenticated) {
        // Redirect to login page but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
