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

  if (loading) return <p style={{ padding: 16 }}>Loading...</p>;

  return (
    <div style={{ padding: 16, display: "grid", gap: 16, maxWidth: 700, margin: "0 auto" }}>
      <h2>My Applications</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {applications.length === 0 && !error && <p>You haven't applied to any jobs yet.</p>}
      {applications.map((app) => (
        <div key={app.applicationId} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: "0 0 8px" }}>{app.title}</h3>
          <p style={{ margin: "0 0 8px", color: "#555" }}>{app.descrip}</p>
          <p>Job Status: {app.jobStatus}</p>
          <p>Application Status: <strong>{app.status}</strong></p>
          <p>Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}