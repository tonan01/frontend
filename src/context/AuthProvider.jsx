// src/context/AuthProvider.jsx

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { login as loginService } from "../api/authService";
import { setAuthHeader, clearAuthHeader } from "../api/axiosConfig";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUserFromToken = (token) => {
    try {
      const decodedUser = jwtDecode(token);
      if (decodedUser.exp * 1000 > Date.now()) {
        // --- PHẦN CẬP NHẬT: ĐỌC TÊN CLAIM NGẮN GỌN ---
        setUser({
          id: decodedUser.sub,
          username: decodedUser.name,
          roles: Array.isArray(decodedUser.role)
            ? decodedUser.role
            : [decodedUser.role],
        });
        // --- KẾT THÚC CẬP NHẬT ---
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
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await loginService(usernameOrEmail, password);
      const { accessToken } = response.data.data;
      localStorage.setItem("token", accessToken);
      updateUserFromToken(accessToken); // Dùng hàm chung để cập nhật
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    clearAuthHeader();
  };

  const value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
