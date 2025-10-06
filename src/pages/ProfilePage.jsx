import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile } from "../api/userService";
import { useNotification } from "../hooks/useNotification"; // 1. Import hook
import { Typography, CircularProgress, Alert } from "@mui/material";
import styles from "./ProfilePage.module.scss";

const ProfilePage = () => {
  const [profile, setProfile] = useState({ firstName: "", lastName: "" });
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(""); // Xóa state cũ
  // const [success, setSuccess] = useState(""); // Xóa state cũ
  const { showNotification } = useNotification(); // 2. Lấy hàm thông báo

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setProfile(response.data.data);
      } catch (err) {
        console.error("Lỗi khi tải profile:", err);
        showNotification("Không thể tải thông tin cá nhân.", "error"); // Thông báo lỗi
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMyProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
      showNotification("Cập nhật thông tin thành công!"); // Thông báo thành công
    } catch (err) {
      console.error("Lỗi khi cập nhật profile:", err);
      showNotification("Cập nhật thất bại. Vui lòng thử lại.", "error"); // Thông báo lỗi
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <div className={styles.pageContainer}>
      <Typography variant="h4" className={styles.title}>
        Thông tin cá nhân
      </Typography>
      {/* 3. Xóa các Alert cũ */}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Họ</label>
          <input
            name="lastName"
            value={profile.lastName || ""}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Tên</label>
          <input
            name="firstName"
            value={profile.firstName || ""}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
