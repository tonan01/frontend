// --- BẮT ĐẦU CẬP NHẬT ---
// Thay đổi import để sử dụng named import
import { apiClient } from "./axiosConfig";
// --- KẾT THÚC CẬP NHẬT ---

export const getTodos = (page = 1, pageSize = 10) => {
  return apiClient.get(`/todos?page=${page}&pageSize=${pageSize}`);
};

export const createTodo = (todo) => apiClient.post("/todos", todo);
export const deleteTodo = (id) => apiClient.delete(`/todos/${id}`);
export const updateTodo = (id, todoData) =>
  apiClient.put(`/todos/${id}`, todoData);