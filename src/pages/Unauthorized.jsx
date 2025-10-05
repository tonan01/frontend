import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>403 - Unauthorized</h1>
      <p>Bạn không có quyền truy cập vào trang này.</p>
      <Link to="/">Quay về trang chủ</Link>
    </div>
  );
};

export default Unauthorized;
