import axios from 'axios';

// API Gateway URL
const API_URL = 'https://localhost:7000/api/v1';

// --- BẮT ĐẦU CẬP NHẬT ---
// Thay đổi từ `const` thành `export const` và xóa `export default` ở cuối
export const apiClient = axios.create({
    baseURL: API_URL,
});
// --- KẾT THÚC CẬP NHẬT ---

export const setAuthHeader = (token) => {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
    delete apiClient.defaults.headers.common['Authorization'];
};

// Dòng `export default apiClient;` đã được xóa