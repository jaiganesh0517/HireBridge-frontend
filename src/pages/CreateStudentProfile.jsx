import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateStudentProfile() {
  const [form, setForm] = useState({
    about: "",
    bacthYear: "",   // typo matches the backend field exactly
    branch: "",
    cgpa: "",
    skills: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/api/students/profile", {
        ...form,
        bacthYear: Number(form.bacthYear), // inputs give strings; backend expects int
        cgpa: Number(form.cgpa),           // backend expects double
      });
      navigate("/jobs");
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.message || "Could not create profile.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "40px auto", display: "grid", gap: 12 }}>
      <h2>Create Student Profile</h2>
      <input name="branch" placeholder="Branch (e.g. CSE)" value={form.branch} onChange={handleChange} />
      <input name="bacthYear" type="number" placeholder="Batch Year (e.g. 2026)" value={form.bacthYear} onChange={handleChange} />
      <input name="cgpa" type="number" step="0.01" placeholder="CGPA" value={form.cgpa} onChange={handleChange} />
      <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} />
      <textarea name="about" placeholder="About you" value={form.about} onChange={handleChange} />
      <button type="submit">Save Profile</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}