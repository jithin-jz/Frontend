import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const PublicRoute = () => {
    const { user, loading } = useAuthStore();

    if (loading) return null;

    if (user) {
        return <Navigate to={user.is_staff ? "/admin/dashboard" : "/"} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
