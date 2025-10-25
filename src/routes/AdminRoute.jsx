import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';

const AdminRoute = ({ children }) => {
  const { user, mongoUser, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  // Check if user is authenticated and is an admin
  if (user && mongoUser?.role === 'admin') {
    return children;
  }

  // Redirect to login if not authenticated, or to home if not admin
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in but not admin, redirect to home
  return <Navigate to="/" replace />;
};

export default AdminRoute;