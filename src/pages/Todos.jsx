import { useState, useEffect } from "react";
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from "../api/todoService";
import { useNotification } from "../hooks/useNotification"; // 1. Import hook
import { Typography, CircularProgress, Pagination, Box } from "@mui/material";
import EditTodoModal from "../components/EditTodoModal";
import styles from "./Todos.module.scss";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { showNotification } = useNotification(); // 2. Lấy hàm thông báo

  useEffect(() => {
    const fetchTodos = async (currentPage) => {
      setLoading(true);
      try {
        const response = await getTodos(currentPage);
        setTodos(response.data.items || []);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        console.error("Failed to fetch todos", error);
        showNotification("Lỗi khi tải danh sách công việc.", "error"); // Thông báo lỗi
      } finally {
        setLoading(false);
      }
    };
    fetchTodos(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createTodo({ title, description: "New todo" });
      setTitle("");
      showNotification("Thêm công việc thành công!"); // Thông báo thành công
      if (page !== 1) {
        setPage(1);
      } else {
        const response = await getTodos(1);
        setTodos(response.data.items || []);
        setTotalPages(response.data.totalPages || 0);
      }
    } catch (error) {
      console.error("Failed to add todo", error);
      showNotification("Thêm công việc thất bại.", "error"); // Thông báo lỗi
    }
  };

  const handleDeleteTodo = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa công việc này?")) {
      try {
        await deleteTodo(id);
        showNotification("Xóa công việc thành công!"); // Thông báo thành công
        const response = await getTodos(page);
        setTodos(response.data.items || []);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        console.error("Failed to delete todo", error);
        showNotification("Xóa công việc thất bại.", "error"); // Thông báo lỗi
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
      showNotification("Cập nhật công việc thành công!"); // Thông báo thành công
      setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update todo", error);
      showNotification("Cập nhật công việc thất bại.", "error"); // Thông báo lỗi
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* ... Giữ nguyên phần JSX ... */}
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
