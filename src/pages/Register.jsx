import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ userName: "", emailId: "", password: "", role: "STUDENT" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/api/auth/register", form);
      navigate("/login");
        } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Register</h2>
      <input name="userName" placeholder="Name" value={form.userName} onChange={handleChange} />
      <input name="emailId" placeholder="Email" value={form.emailId} onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
<small style={{ color: "var(--slate)" }}>
  Minimum 6 characters, including one special character
</small>
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="STUDENT">Student</option>
        <option value="RECRUITER">Recruiter</option>
      </select>
      <button type="submit">Register</button>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
}