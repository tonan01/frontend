import { useState, useEffect } from "react";
import { getUsers, deleteUser } from "../api/userService";
import { useAuth } from "../hooks/useAuth";
import { Typography, CircularProgress, Pagination, Box } from "@mui/material";
import styles from "./UserManagement.module.scss";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  // State cho phân trang
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
      } finally {
        setLoading(false);
      }
    };
    fetchUsers(page);
  }, [page]); // Chạy lại mỗi khi 'page' thay đổi

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDelete = async (userId) => {
    if (userId === currentUser.id) {
      alert("Bạn không thể xóa chính mình!");
      return;
    }
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await deleteUser(userId);
        // Sau khi xóa, fetch lại dữ liệu của trang hiện tại để cập nhật
        const response = await getUsers(page);
        setUsers(response.data.items || []);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        console.error("Failed to delete user", error);
        alert("Xóa người dùng thất bại.");
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
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
