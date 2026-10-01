import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/application/myApplications")
      .then((res) => setApplications(res.data))
      .catch((err) => {
        console.log(err.response);
        setError(err.response?.data?.message || "Could not load applications.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="page">Loading...</p>;

  return (
    <div className="page stack">
      <h2>My Applications</h2>
      {error && <p className="error-text">{error}</p>}
      {applications.length === 0 && !error && <p className="empty-state">You haven't applied to any jobs yet.</p>}
      {applications.map((app) => (
        <div key={app.applicationId} className="card">
          <h3>{app.title}</h3>
          <p>{app.discrip}</p>
          <p>Job status: <span className={`tag tag-${app.jobStatus.toLowerCase()}`}>{app.jobStatus}</span></p>
          <p style={{ marginTop: 8 }}>Your status: <span className={`tag tag-${app.status.toLowerCase()}`}>{app.status}</span></p>
          <p>Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}