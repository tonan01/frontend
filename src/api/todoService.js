import apiClient from './axiosConfig';

export const getTodos = () => apiClient.get('/todos');
export const createTodo = (todo) => apiClient.post('/todos', todo);
export const deleteTodo = (id) => apiClient.delete(`/todos/${id}`);