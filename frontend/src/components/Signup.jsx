import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Frontend se Backend API hit ho rahi hai yahan
      const response = await axios.post("http://localhost:4000/api/auth/signup", formData);
      
      if (response.data) {
        alert("Signup Success! 🎉");
        // User ka data aur token browser ke localStorage mein save kar rahe hain
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        navigate("/editor"); // Signup hote hi editor page par bhej do
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup mein kuch gadbad hui bhai!");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc" }}>
      <h2>Create Account (Signup)</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required style={{ width: "100%", margin: "10px 0", padding: "8px" }} />
        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required style={{ width: "100%", margin: "10px 0", padding: "8px" }} />
        <input type="password" name="password" placeholder="Password (Min 6 chars)" onChange={handleChange} required style={{ width: "100%", margin: "10px 0", padding: "8px" }} />
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#007bff", color: "#fff", border: "none" }}>Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;