import { useAuth } from "../context/AuthContext";
import NotAuthorized from "../components/NotAuthorized";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait for AuthContext to load localStorage data
  if (loading) return null;

  // Not logged in
  if (!user) return <NotAuthorized />;

  // Logged in but NOT admin
  if (!user.is_staff) return <NotAuthorized />;

  // Admin allowed
  return children;
};

export default AdminRoute;
