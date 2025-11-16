import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Still fetching /auth/me
  if (loading) {
    return (
      <div className="text-white p-10 text-center">
        Loading...
      </div>
    );
  }

  // After loading is done and user is definitely null → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
