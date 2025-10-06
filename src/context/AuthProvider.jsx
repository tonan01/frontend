import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  login as loginService,
  logout as logoutService,
} from "../api/authService";
import { setAuthHeader, clearAuthHeader } from "../api/axiosConfig";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUserFromToken = (token) => {
    try {
      const decodedUser = jwtDecode(token);

      // Dòng console.log này bạn có thể xóa đi sau khi đã sửa lỗi thành công
      console.log("Nội dung token đã giải mã:", decodedUser);

      if (decodedUser.exp * 1000 > Date.now()) {
        const roles = Array.isArray(decodedUser.role)
          ? decodedUser.role
          : [decodedUser.role];

        // --- BẮT ĐẦU SỬA LỖI ---
        // Cập nhật để đọc đúng key từ token
        setUser({
          id: decodedUser.sub || decodedUser.nameid, // Lấy ID từ 'sub' hoặc 'nameid'
          username: decodedUser.unique_name || decodedUser.name, // Lấy username từ 'unique_name' hoặc 'name'
          fullName: decodedUser.fullName,
          email: decodedUser.email, // Lấy thêm email
          roles: roles,
        });
        // --- KẾT THÚC SỬA LỖI ---

        setAuthHeader(token);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
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
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      updateUserFromToken(accessToken);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error("Server logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
      clearAuthHeader();
    }
  };

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
