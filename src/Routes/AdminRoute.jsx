import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const AdminRoute = () => {
    const { user, loading } = useAuthStore();

    if (loading) return null;

    if (!user) return <Navigate to="/login" replace />;
    
    if (!user.is_staff) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default AdminRoute;
