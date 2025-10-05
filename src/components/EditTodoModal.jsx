// src/components/EditTodoModal.jsx
import { useState, useEffect } from "react";
import { Modal, Box, Typography } from "@mui/material";
import styles from "./EditTodoModal.module.scss";

const EditTodoModal = ({ open, onClose, todo, onSave }) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
    }
  }, [todo]);

  const handleSave = () => {
    onSave({ ...todo, title });
  };

  if (!todo) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalBox}>
        <Typography variant="h6" component="h2" className={styles.title}>
          Chỉnh sửa công việc
        </Typography>
        <div className={styles.formGroup}>
          <label className={styles.label}>Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button
            onClick={onClose}
            className={`${styles.button} ${styles.cancelButton}`}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className={`${styles.button} ${styles.saveButton}`}
          >
            Lưu
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default EditTodoModal;
