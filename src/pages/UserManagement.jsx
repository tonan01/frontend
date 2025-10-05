import { useState, useEffect } from "react";
import { getUsers, deleteUser } from "../api/userService";
import { useAuth } from "../hooks/useAuth";
import { Typography, CircularProgress } from "@mui/material";
import styles from "./UserManagement.module.scss"; // Import SCSS module

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        // API trả về data trong pagedResult, nên cần lấy `items`
        setUsers(response.data.items || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (userId === currentUser.id) {
      alert("Bạn không thể xóa chính mình!");
      return;
    }
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((u) => u.id !== userId));
      } catch (error) {
        console.error("Failed to delete user", error);
        alert("Xóa người dùng thất bại.");
      }
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <div className={styles.pageContainer}>
      <Typography variant="h4" className={styles.title}>
        Quản lý Người dùng
      </Typography>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Họ và Tên</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.fullName}</td>
              <td>
                <button
                  onClick={() => handleDelete(user.id)}
                  className={styles.deleteButton}
                  disabled={user.id === currentUser.id} // Vô hiệu hóa nút xóa cho chính mình
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
