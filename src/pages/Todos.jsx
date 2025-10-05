import { useState, useEffect } from "react";
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from "../api/todoService";
import { Typography, CircularProgress, Pagination, Box } from "@mui/material";
import EditTodoModal from "../components/EditTodoModal";
import styles from "./Todos.module.scss";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingTodo, setEditingTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State cho phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchTodos = async (currentPage) => {
      setLoading(true);
      try {
        const response = await getTodos(currentPage);
        setTodos(response.data.items || []);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        console.error("Failed to fetch todos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos(page);
  }, [page]); // Chạy lại khi 'page' thay đổi

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createTodo({ title, description: "New todo" });
      setTitle("");
      // Sau khi thêm, quay về trang 1 để thấy item mới nhất
      if (page !== 1) {
        setPage(1);
      } else {
        // Nếu đang ở trang 1, fetch lại để cập nhật
        const response = await getTodos(1);
        setTodos(response.data.items || []);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (error) {
      console.error("Failed to add todo", error);
    }
  };

  // ... các hàm handleDeleteTodo, handleOpenEditModal, handleCloseModal, handleSaveTodo giữ nguyên ...
  const handleDeleteTodo = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa công việc này?")) {
      try {
        await deleteTodo(id);
        // Fetch lại trang hiện tại để cập nhật sau khi xóa
        const response = await getTodos(page);
        setTodos(response.data.items || []);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        console.error("Failed to delete todo", error);
      }
    }
  };
  const handleOpenEditModal = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };
  const handleSaveTodo = async (updatedTodo) => {
    try {
      const todoDataToUpdate = {
        id: updatedTodo.id,
        title: updatedTodo.title,
        description: updatedTodo.description,
        isCompleted: updatedTodo.isCompleted,
        dueDate: updatedTodo.dueDate,
        priority: updatedTodo.priority,
      };
      await updateTodo(updatedTodo.id, todoDataToUpdate);
      setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update todo", error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Typography variant="h4" className={styles.title}>
        Quản lý Công việc
      </Typography>
      <form onSubmit={handleAddTodo} className={styles.addForm}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Thêm công việc mới..."
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Thêm
        </button>
      </form>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <ul className={styles.todoList}>
            {todos.map((todo) => (
              <li key={todo.id} className={styles.todoItem}>
                <span>{todo.title}</span>
                <div>
                  <button
                    onClick={() => handleOpenEditModal(todo)}
                    className={styles.editButton}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className={styles.deleteButton}
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}

      <EditTodoModal
        open={isModalOpen}
        onClose={handleCloseModal}
        todo={editingTodo}
        onSave={handleSaveTodo}
      />
    </div>
  );
};

export default Todos;
