import { useState, useEffect } from "react";
import { getTodos, createTodo, deleteTodo } from "../api/todoService";
import { Typography, CircularProgress } from "@mui/material";
import styles from "./Todos.module.scss"; // Import SCSS module

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

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
      const newTodo = { title, description: "New todo description" };
      const response = await createTodo(newTodo);
      setTodos([response.data, ...todos]);
      setTitle("");
    } catch (error) {
      console.error("Failed to add todo", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Failed to delete todo", error);
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
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className={styles.deleteButton}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
