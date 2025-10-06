import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
// --- BẮT ĐẦU CẬP NHẬT ---
// Import cả loginService và logoutService
import {
  login as loginService,
  logout as logoutService,
} from "../api/authService";
// --- KẾT THÚC CẬP NHẬT ---
import { setAuthHeader, clearAuthHeader } from "../api/axiosConfig";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUserFromToken = (token) => {
    try {
      const decodedUser = jwtDecode(token);
      if (decodedUser.exp * 1000 > Date.now()) {
        setUser({
          id: decodedUser.sub,
          username: decodedUser.name,
          roles: Array.isArray(decodedUser.role)
            ? decodedUser.role
            : [decodedUser.role],
        });
        setAuthHeader(token);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      updateUserFromToken(token);
    }
    setLoading(false);
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await loginService(usernameOrEmail, password);
      // --- BẮT ĐẦU CẬP NHẬT ---
      // Lấy accessToken và refreshToken từ response
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem("token", accessToken);
      // Lưu refreshToken để sử dụng sau này (nếu cần)
      localStorage.setItem("refreshToken", refreshToken);
      updateUserFromToken(accessToken);
      // --- KẾT THÚC CẬP NHẬT ---
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // --- BẮT ĐẦU CẬP NHẬT: Cập nhật hàm logout ---
  const logout = async () => {
    try {
      // Gọi API logout để vô hiệu hóa token trên server
      await logoutService();
    } catch (error) {
      console.error("Server logout failed:", error);
      // Dù server có lỗi, vẫn tiến hành logout ở client
    } finally {
      // Xóa tất cả token đã lưu
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
      clearAuthHeader();
    }
  };
  // --- KẾT THÚC CẬP NHẬT ---

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
