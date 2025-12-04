// src/pages/VerifyOTP.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    const email = localStorage.getItem("pendingEmail");
    if (!email) {
      setError("Email not found. Please login again.");
      return navigate("/login");
    }

    try {
      const res = await fetch("http://localhost:3000/users/verify-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP");
        return;
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Clear pending email
      localStorage.removeItem("pendingEmail");

      navigate("/movies"); // Redirect to home
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Verify OTP</h2>

      <form onSubmit={handleVerify} style={styles.form}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "10px", fontSize: "16px" },
  button: {
    padding: "10px",
    fontSize: "16px",
    background: "green",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  error: { color: "red" },
};
