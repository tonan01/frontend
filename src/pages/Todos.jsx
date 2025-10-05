import { useState, useEffect } from "react";
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from "../api/todoService";
import { Typography, CircularProgress } from "@mui/material";
import EditTodoModal from "../components/EditTodoModal"; // Import modal
import styles from "./Todos.module.scss";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // State cho modal
  const [editingTodo, setEditingTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await getTodos();
        setTodos(response.data);
      } catch (error) {
        console.error("Failed to fetch todos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const newTodo = {
        title,
        description: "New todo description",
        priority: 1,
      };
      const response = await createTodo(newTodo);
      // Thêm todo mới vào đầu danh sách để hiển thị ngay lập tức
      setTodos([response.data, ...todos]);
      setTitle("");
    } catch (error) {
      console.error("Failed to add todo", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa công việc này?")) {
      try {
        await deleteTodo(id);
        setTodos(todos.filter((todo) => todo.id !== id));
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
      // Chuẩn bị dữ liệu để gửi lên API (chỉ gửi các trường cần thiết)
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

  if (loading) return <CircularProgress />;

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
