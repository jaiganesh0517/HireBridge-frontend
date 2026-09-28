import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser's default page reload
    setError("");
    try {
      const res = await api.post("/api/auth/login", { emailId, password });
      login(res.data); // { userId, role, token }
      navigate("/jobs");
    } catch (err) {
      console.log(err.response); // inspect this to see your backend's error shape
      setError("Login failed. Check your email and password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "40px auto", display: "grid", gap: 12 }}>
      <h2>Login</h2>
      <input placeholder="Email" value={emailId} onChange={(e) => setEmailId(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}