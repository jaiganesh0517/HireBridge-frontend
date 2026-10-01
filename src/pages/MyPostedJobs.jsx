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

  if (loading) return <p className="page">Loading...</p>;

  return (
    <div className="page stack">
      <h2>My Posted Jobs</h2>
      {error && <p className="error-text">{error}</p>}
      {jobs.length === 0 && !error && <p className="empty-state">You haven't posted any jobs yet.</p>}
      {jobs.map((job) => (
        <div key={job.jobPostId} className="card">
          <h3>{job.title}</h3>
          <p>{job.descrip}</p>
          <p>CTC: ₹{job.ctc.toLocaleString("en-IN")} &nbsp;·&nbsp; Min CGPA: {job.minCgpa}</p>
          <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
          <span className={`tag tag-${job.jobStatus.toLowerCase()}`}>{job.jobStatus}</span>
          <div style={{ marginTop: 12 }}>
            <Link to={`/jobs/${job.jobPostId}/applicants`}>View Applicants</Link>
          </div>
        </div>
      ))}
    </div>
  );
}