import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Todos from "./pages/Todos";
import UserManagement from "./pages/UserManagement";
import Unauthorized from "./pages/Unauthorized";
import ProfilePage from "./pages/ProfilePage";

import MainLayout from "./components/MainLayout";
import PrivateRoute from "./components/PrivateRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";

const ROLES = {
  User: "User",
  Manager: "Manager",
  Admin: "Admin",
};

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ================= PRIVATE ROUTES ================= */}
      {/* Bọc tất cả các route cần đăng nhập bằng PrivateRoute */}
      <Route element={<PrivateRoute />}>
        {/* Sau khi đăng nhập, hiển thị MainLayout */}
        <Route element={<MainLayout />}>
          {/* Các trang con sẽ nằm bên trong MainLayout */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/todos" element={<Todos />} />

          {/* Route yêu cầu quyền Admin/Manager */}
          <Route
            element={
              <RoleBasedRoute allowedRoles={[ROLES.Admin, ROLES.Manager]} />
            }
          >
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;
