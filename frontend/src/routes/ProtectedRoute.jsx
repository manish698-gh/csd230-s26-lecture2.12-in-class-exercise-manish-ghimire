import { Navigate, Outlet } from "react-router";
import { useAuth } from "../provider/AuthProvider";

export const ProtectedRoute = () => {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};