import apiClient from './axiosConfig';

export const login = (usernameOrEmail, password) => {
    return apiClient.post('/auth/login', { usernameOrEmail, password });
};

export const register = (userData) => {
    return apiClient.post('/auth/register', userData);
};