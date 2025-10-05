import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleBasedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    // Tìm xem user có ít nhất một vai trò được cho phép không
    const isAuthorized = user?.roles?.some(role => allowedRoles.includes(role));

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default RoleBasedRoute;