// --- BẮT ĐẦU CẬP NHẬT ---
// Thay đổi import để sử dụng named import
import { apiClient } from './axiosConfig';
// --- KẾT THÚC CẬP NHẬT ---

export const login = (usernameOrEmail, password) => {
    return apiClient.post('/auth/login', { usernameOrEmail, password });
};

export const register = (userData) => {
    return apiClient.post('/auth/register', userData);
};

export const logout = () => {
    return apiClient.post('/auth/logout-all');
};