import { useState, useEffect } from "react";
import { getUsers, deleteUser } from "../api/userService";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification"; // 1. Import hook
import { Typography, CircularProgress, Pagination, Box } from "@mui/material";
import styles from "./UserManagement.module.scss";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const { showNotification } = useNotification(); // 2. Lấy hàm thông báo
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUsers = async (currentPage) => {
      setLoading(true);
      try {
        const response = await getUsers(currentPage);
        setUsers(response.data.items || []);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        console.error("Failed to fetch users", error);
        showNotification("Lỗi khi tải danh sách người dùng.", "error"); // Thông báo lỗi
      } finally {
        setLoading(false);
      }
    };
    fetchUsers(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDelete = async (userId) => {
    if (userId === currentUser.id) {
      showNotification("Bạn không thể xóa chính mình!", "warning"); // Thông báo cảnh báo
      return;
    }
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await deleteUser(userId);
        showNotification("Xóa người dùng thành công!"); // Thông báo thành công
        const response = await getUsers(page);
        setUsers(response.data.items || []);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        console.error("Failed to delete user", error);
        showNotification("Xóa người dùng thất bại.", "error"); // Thông báo lỗi
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* ... Giữ nguyên phần JSX ... */}
      <Typography variant="h4" className={styles.title}>
        Quản lý Người dùng
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
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
                      disabled={user.id === currentUser.id}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
    </div>
  );
};

export default UserManagement;
