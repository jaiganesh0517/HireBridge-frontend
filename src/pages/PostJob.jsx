import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PostJob() {
  const [form, setForm] = useState({ title: "", descrip: "", ctc: "", minCgpa: "", deadline: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // datetime-local gives "2026-12-31T23:59"; backend LocalDateTime needs seconds too
      const deadlineWithSeconds = form.deadline.length === 16 ? form.deadline + ":00" : form.deadline;

      const res = await api.post("/api/jobs", {
        ...form,
        ctc: Number(form.ctc),
        minCgpa: Number(form.minCgpa),
        deadline: deadlineWithSeconds,
      });

      const newJobId = res.data.jobPostId; // adjust key if your response differs
      navigate(`/post-job/${newJobId}/branches`);
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.message || "Could not post job.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "40px auto", display: "grid", gap: 12 }}>
      <h2>Post a Job</h2>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <textarea name="descrip" placeholder="Description" value={form.descrip} onChange={handleChange} />
      <input name="ctc" type="number" placeholder="CTC (annual, in ₹)" value={form.ctc} onChange={handleChange} />
      <input name="minCgpa" type="number" step="0.01" placeholder="Minimum CGPA" value={form.minCgpa} onChange={handleChange} />
      <input name="deadline" type="datetime-local" value={form.deadline} onChange={handleChange} />
      <button type="submit">Post Job</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}