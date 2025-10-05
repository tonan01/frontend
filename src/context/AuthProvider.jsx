import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { login as loginService } from "../api/authService";
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

  // === PHẦN SỬA LỖI 1: ĐIỀN ĐẦY ĐỦ NỘI DUNG HÀM LOGIN ===
  const login = async (usernameOrEmail, password) => {
    try {
      const response = await loginService(usernameOrEmail, password);
      const { accessToken } = response.data.data;
      localStorage.setItem("token", accessToken);
      updateUserFromToken(accessToken);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // === PHẦN SỬA LỖI 2: ĐIỀN ĐẦY ĐỦ NỘI DUNG HÀM LOGOUT ===
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    clearAuthHeader(); // Sử dụng hàm đã import
  };

  const value = { user, loading, login, logout };

  // Sửa lỗi cú pháp ở đây: Phải là AuthContext.Provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
