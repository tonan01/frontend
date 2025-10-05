import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Todos from './pages/Todos';
import UserManagement from './pages/UserManagement';
import Unauthorized from './pages/Unauthorized';

import MainLayout from './components/MainLayout'; // Import layout mới
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

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

            {/* --- WRAP PRIVATE ROUTES WITH MAINLAYOUT --- */}
            <Route element={<MainLayout />}>
                {/* Private Routes for all authenticated users */}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/todos" element={<Todos />} />
                </Route>

                {/* Role-based Routes */}
                <Route element={<RoleBasedRoute allowedRoles={[ROLES.Admin, ROLES.Manager]} />}>
                    <Route path="/admin/users" element={<UserManagement />} />
                </Route>
            </Route>
            
            {/* Fallback Route */}
            <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
    );
}

export default App;