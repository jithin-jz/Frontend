import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Avoid redirecting before auth initializes
  if (loading) {
    return (
      <div className="text-white p-10 text-center">
        Loading...
      </div>
    );
  }

  // No user after loading → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
