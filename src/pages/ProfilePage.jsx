import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile } from "../api/userService";
import { Typography, CircularProgress, Alert } from "@mui/material";
import styles from "./ProfilePage.module.scss";

const ProfilePage = () => {
  // Xóa middleName khỏi state
  const [profile, setProfile] = useState({ firstName: "", lastName: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setProfile(response.data.data);
      } catch (err) {
        console.error("Lỗi khi tải profile:", err);
        setError("Không thể tải thông tin cá nhân.");
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
    setError("");
    setSuccess("");
    try {
      // Xóa middleName khỏi dữ liệu gửi đi
      await updateMyProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
      setSuccess("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật profile:", err);
      setError("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <div className={styles.pageContainer}>
      <Typography variant="h4" className={styles.title}>
        Thông tin cá nhân
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
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
        {/* Xóa trường nhập Tên đệm */}
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
