import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  // Still fetching /auth/me
  if (loading) {
    return (
      <div className="text-white p-10 text-center">
        Loading...
      </div>
    );
  }

  // After loading, if user is still null — not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // PASS
  return children;
};

export default AdminRoute;
