// --- BẮT ĐẦU CẬP NHẬT ---
// Thay đổi import để sử dụng named import
import { apiClient } from "./axiosConfig";
// --- KẾT THÚC CẬP NHẬT ---

export const getUsers = (page = 1, pageSize = 10) => {
  return apiClient.get(`/users?page=${page}&pageSize=${pageSize}`);
};

export const deleteUser = (id) => apiClient.delete(`/users/${id}`);

export const getMyProfile = () => apiClient.get("/users/me");
export const updateMyProfile = (profileData) =>
  apiClient.put("/users/me", profileData);