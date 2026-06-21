import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
     const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, 
      formData
    );
      
      if (response.data) {
        alert("Welcome Back! 🚀");
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        navigate("/editor"); // Login hote hi editor par dispatch karo
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login fail ho gaya bhai!");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required style={{ width: "100%", margin: "10px 0", padding: "8px" }} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ width: "100%", margin: "10px 0", padding: "8px" }} />
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#28a745", color: "#fff", border: "none" }}>Login</button>
      </form>
    </div>
  );
};

export default Login;