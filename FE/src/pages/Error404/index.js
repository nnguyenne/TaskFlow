const Error404 = () => {
  return (
    <div style={styles.wrapper}>
      <h1 style={styles.heading}>404</h1>
      <p style={styles.message}>Xin lỗi, trang bạn tìm không tồn tại.</p>
      <a href="/" style={styles.button}>Quay về trang chủ</a>
    </div>
  );
};

const bounce = {
  animation: "bounce 1s infinite",
};

const styles = {
  wrapper: {
    height: "100vh",
    background: "linear-gradient(135deg, #ff6a00, #ee0979)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    color: "white",
    textAlign: "center",
  },
  heading: {
    fontSize: "10rem",
    ...bounce,
  },
  message: {
    fontSize: "1.5rem",
    margin: "20px 0",
  },
  button: {
    textDecoration: "none",
    padding: "10px 20px",
    background: "white",
    color: "#ff0066",
    borderRadius: "5px",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
};

// Tạo animation CSS
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`, styleSheet.cssRules.length);

export default Error404;
