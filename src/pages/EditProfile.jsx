import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isStudent = user.role === "STUDENT";

  const GET_URL = isStudent ? "/api/students/profile" : "/api/recruiter/profile";

  // verify: set these to match your real edit endpoints (path + method)
  const EDIT_URL = isStudent ? "/api/students/profile" : "/api/recruiter/profile";
  const EDIT_METHOD = "put";

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // load current profile and pre-fill the form
  useEffect(() => {
    api.get(GET_URL)
      .then((res) => {
        const d = res.data;
        setForm(
          isStudent
            ? { about: d.about ?? "", batchYear: d.batchYear ?? "", branch: d.branch ?? "", cgpa: d.cgpa ?? "", skills: d.skills ?? "" }
            : { companyName: d.companyName ?? "", designation: d.designation ?? "", summary: d.summary ?? "" }
        );
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load profile"));
  }, [GET_URL, isStudent]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();          // must stay the first line
    setError("");
    setSaving(true);

    const payload = isStudent
      ? { ...form, batchYear: Number(form.batchYear), cgpa: Number(form.cgpa) }
      : form;

    try {
      await api.request({ method: EDIT_METHOD, url: EDIT_URL, data: payload });
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save changes");
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <div className="page">
        {error ? <p className="error-text">{error}</p> : <p>Loading...</p>}
      </div>
    );
  }

  return (
    <div className="page">
      <form className="form card" onSubmit={handleSubmit}>
        <h2>Edit profile</h2>

        {isStudent ? (
          <>
            <label>Branch
              <input name="branch" value={form.branch} onChange={handleChange} required />
            </label>
            <label>CGPA
              <input name="cgpa" type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={handleChange} required />
            </label>
            <label>Batch year
              <input name="batchYear" type="number" value={form.batchYear} onChange={handleChange} required />
            </label>
            <label>Skills (comma separated)
              <input name="skills" value={form.skills} onChange={handleChange} />
            </label>
            <label>About
              <textarea name="about" rows="4" value={form.about} onChange={handleChange} />
            </label>
          </>
        ) : (
          <>
            <label>Company name
              <input name="companyName" value={form.companyName} onChange={handleChange} required />
            </label>
            <label>Designation
              <input name="designation" value={form.designation} onChange={handleChange} required />
            </label>
            <label>Summary
              <textarea name="summary" rows="4" value={form.summary} onChange={handleChange} />
            </label>
          </>
        )}

        {error && <p className="error-text">{error}</p>}

        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate("/profile")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}