import apiClient from './axiosConfig';

export const getUsers = () => apiClient.get('/users');
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);