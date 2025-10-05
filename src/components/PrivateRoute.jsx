// src/components/PrivateRoute.jsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CircularProgress, Box } from "@mui/material";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  // Nếu đang trong quá trình kiểm tra token, hiển thị màn hình loading
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Sau khi kiểm tra xong, nếu có user thì cho vào, không thì đá về login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
