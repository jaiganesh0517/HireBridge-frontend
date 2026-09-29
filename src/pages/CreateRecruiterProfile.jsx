import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateRecruiterProfile() {
  const [form, setForm] = useState({ companyName: "", designation: "", summary: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/api/recruiter/profile", form);
      navigate("/jobs");
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.message || "Could not create profile.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "40px auto", display: "grid", gap: 12 }}>
      <h2>Create Recruiter Profile</h2>
      <input name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} />
      <input name="designation" placeholder="Your Designation" value={form.designation} onChange={handleChange} />
      <textarea name="summary" placeholder="Company Summary" value={form.summary} onChange={handleChange} />
      <button type="submit">Save Profile</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}