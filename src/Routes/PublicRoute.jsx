import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  // Wait until /auth/me resolves
  if (loading) {
    return (
      <div className="text-white p-10 text-center">
        Loading...
      </div>
    );
  }

  // Logged-in users cannot access login/register
  if (user) {
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Not logged in → allow access
  return children;
};

export default PublicRoute;
