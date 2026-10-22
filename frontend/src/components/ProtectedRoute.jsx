import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, hasRole, homeForRol } from "../utils/session";

function ProtectedRoute({ roles = [], children }) {

    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (!hasRole(roles)) {
        return <Navigate to={homeForRol()} replace />;
    }

    return children;
}

export default ProtectedRoute;
