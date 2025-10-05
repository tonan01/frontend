import axios from 'axios';

// API Gateway URL
const API_URL = 'https://localhost:7000/api/v1';

const apiClient = axios.create({
    baseURL: API_URL,
});

export const setAuthHeader = (token) => {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
    delete apiClient.defaults.headers.common['Authorization'];
};

export default apiClient;