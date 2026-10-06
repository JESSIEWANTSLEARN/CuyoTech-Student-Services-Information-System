import { Navigate } from "react-router-dom";
import {
    getAuthToken,
    getAuthUser,
    getDashboardPath,
} from "../services/auth.js";

function ProtectedRoute({ allowedRoles, children }) {
    const token = getAuthToken();
    const user = getAuthUser();

    if (!token || !user) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={getDashboardPath(user.role)} replace />;
    }

    return children;
}

export default ProtectedRoute;
