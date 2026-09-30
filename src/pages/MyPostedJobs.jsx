import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function MyPostedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/myJobs")
      .then((res) => setJobs(res.data))
      .catch((err) => {
        console.log(err.response);
        setError(err.response?.data?.message || "Could not load your jobs.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 16 }}>Loading...</p>;

  return (
    <div style={{ padding: 16, display: "grid", gap: 16, maxWidth: 700, margin: "0 auto" }}>
      <h2>My Posted Jobs</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {jobs.length === 0 && !error && <p>You haven't posted any jobs yet.</p>}
      {jobs.map((job) => (
        <div key={job.jobPostId} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: "0 0 8px" }}>{job.title}</h3>
          <p style={{ margin: "0 0 8px", color: "#555" }}>{job.descrip}</p>
          <p>CTC: ₹{job.ctc.toLocaleString("en-IN")}</p>
          <p>Min CGPA: {job.minCgpa}</p>
          <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
          <p>Status: {job.jobStatus}</p>
          <Link to={`/jobs/${job.jobPostId}/applicants`}>View Applicants</Link>
        </div>
      ))}
    </div>
  );
}