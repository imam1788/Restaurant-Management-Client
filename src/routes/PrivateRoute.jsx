import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  if (user) {
    return children;
  }

  // Redirect to login if not authenticated, and remember current page
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
