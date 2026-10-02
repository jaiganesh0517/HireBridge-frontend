import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({});
  const [title, setTitle] = useState("");
  const [skill, setSkill] = useState("");
  const { user } = useAuth();

  const loadAllJobs = () => {
    setLoading(true);
    api.get("/api/jobs")
      .then((res) => setJobs(res.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAllJobs(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    const params = {};
    if (title.trim()) params.title = title.trim();
    if (skill.trim()) params.skill = skill.trim();

    api.get("/api/jobs/search", { params })
      .then((res) => setJobs(res.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  const handleClear = () => {
    setTitle("");
    setSkill("");
    loadAllJobs();
  };

  const handleApply = async (jobId) => {
    setMessages((prev) => ({ ...prev, [jobId]: { text: "Applying...", ok: true } }));
    try {
      await api.post(`/api/application/${jobId}/apply`);
      setMessages((prev) => ({ ...prev, [jobId]: { text: "Applied successfully!", ok: true } }));
    } catch (err) {
      const text = err.response?.data?.message || "Could not apply. Check eligibility.";
      setMessages((prev) => ({ ...prev, [jobId]: { text, ok: false } }));
    }
  };

  return (
    <div className="page stack">
      <h2>Open Jobs</h2>

      <form onSubmit={handleSearch} className="search-bar">
        <input placeholder="Search by title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Search by skill" value={skill} onChange={(e) => setSkill(e.target.value)} />
        <button type="submit">Search</button>
        {(title || skill) && <button type="button" className="secondary" onClick={handleClear}>Clear</button>}
      </form>

      {loading && <p>Loading jobs...</p>}
      {!loading && jobs.length === 0 && <p className="empty-state">No jobs match your search.</p>}

      {!loading && jobs.map((job) => (
        <div key={job.jobPostId} className="card">
          <h3>{job.title}</h3>
          <p>{job.descrip}</p>
          <p>CTC: ₹{job.ctc.toLocaleString("en-IN")} &nbsp;·&nbsp; Min CGPA: {job.minCgpa}</p>
          <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
          <span className={`tag tag-${job.jobStatus.toLowerCase()}`}>{job.jobStatus}</span>

          {user?.role === "STUDENT" && job.jobStatus === "OPEN" && (
            <div style={{ marginTop: 12 }}>
              <button onClick={() => handleApply(job.jobPostId)}>Apply</button>
            </div>
          )}

          {messages[job.jobPostId] && (
            <p className={messages[job.jobPostId].ok ? "success-text" : "error-text"} style={{ marginTop: 8 }}>
              {messages[job.jobPostId].text}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}