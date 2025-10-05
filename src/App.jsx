import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Todos from './pages/Todos';
import UserManagement from './pages/UserManagement';
import Unauthorized from './pages/Unauthorized';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

// Định nghĩa vai trò
const ROLES = {
    User: 'User',
    Manager: 'Manager',
    Admin: 'Admin',
};

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Private Routes for all authenticated users */}
            <Route element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/todos" element={<Todos />} />
            </Route>

            {/* Role-based Routes */}
            <Route element={<RoleBasedRoute allowedRoles={[ROLES.Admin, ROLES.Manager]} />}>
                <Route path="/admin/users" element={<UserManagement />} />
            </Route>
            
            {/* Fallback Route */}
            <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
    );
}

export default App;