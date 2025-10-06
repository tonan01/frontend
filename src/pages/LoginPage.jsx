import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification"; // 1. Import hook
import styles from "./LoginPage.module.scss";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState(""); // 2. Xóa state lỗi cũ
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useNotification(); // 3. Lấy hàm showNotification

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setError(""); // Xóa
    const success = await login(username, password);
    if (success) {
      showNotification("Đăng nhập thành công!"); // 4. Hiển thị thông báo thành công
      navigate("/");
    } else {
      // setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."); // Thay bằng...
      showNotification(
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
        "error"
      ); // 4. Hiển thị thông báo lỗi
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h2 className={styles.title}>Đăng Nhập</h2>
        <form onSubmit={handleSubmit}>
          {/* ... giữ nguyên các input ... */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Tên đăng nhập hoặc Email</label>
            <input
              type="text"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Mật khẩu</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Đăng Nhập
          </button>

          {/* 5. Không cần hiển thị lỗi ở đây nữa */}
          {/* {error && <p className={styles.error}>{error}</p>} */}
        </form>
        <p className={styles.linkText}>
          Chưa có tài khoản? <Link to="/register">Đăng ký tại đây</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
