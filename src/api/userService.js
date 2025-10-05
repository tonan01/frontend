// src/api/userService.js
import apiClient from "./axiosConfig";

// --- CẬP NHẬT HÀM NÀY ---
export const getUsers = (page = 1, pageSize = 10) => {
  return apiClient.get(`/users?page=${page}&pageSize=${pageSize}`);
};

export const deleteUser = (id) => apiClient.delete(`/users/${id}`);

// --- THÊM CÁC HÀM MỚI ---
export const getMyProfile = () => apiClient.get("/users/me");
export const updateMyProfile = (profileData) =>
  apiClient.put("/users/me", profileData);
