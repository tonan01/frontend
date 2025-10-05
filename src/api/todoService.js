// src/api/todoService.js
import apiClient from "./axiosConfig";

// --- CẬP NHẬT HÀM NÀY ---
export const getTodos = (page = 1, pageSize = 10) => {
  return apiClient.get(`/todos?page=${page}&pageSize=${pageSize}`);
};

export const createTodo = (todo) => apiClient.post("/todos", todo);
export const deleteTodo = (id) => apiClient.delete(`/todos/${id}`);
export const updateTodo = (id, todoData) =>
  apiClient.put(`/todos/${id}`, todoData);
