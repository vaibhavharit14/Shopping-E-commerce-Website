import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    if (!user) {
        // Not logged in, redirect to login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.role !== 'admin') {
        // Logged in but not an admin
        toast.error("Access Denied: Admin privileges required.");
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
