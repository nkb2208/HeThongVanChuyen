import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ requiredRole }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded.vaiTro;

        if (requiredRole && userRole !== requiredRole) {
            alert("Bạn không có quyền truy cập trang này!");
            return <Navigate to="/login" replace />;
        }

        return <Outlet />;
        
    } catch (error) {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }
}

export default ProtectedRoute;