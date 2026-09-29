import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({}); // { [jobPostId]: "success or error text" }
  const { user } = useAuth();

  useEffect(() => {
    api.get("/api/jobs")
      .then((res) => setJobs(res.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (jobId) => {
    setMessages((prev) => ({ ...prev, [jobId]: "Applying..." }));
    try {
      await api.post(`/api/application/${jobId}/apply`);
      setMessages((prev) => ({ ...prev, [jobId]: "Applied successfully!" }));
    } catch (err) {
      console.log(err.response);
      // Adjust "message" below to match your GlobalExceptionHandler's actual field name
      const text = err.response?.data?.message || "Could not apply. Check eligibility.";
      setMessages((prev) => ({ ...prev, [jobId]: text }));
    }
  };

  if (loading) return <p style={{ padding: 16 }}>Loading jobs...</p>;

  return (
    <div style={{ padding: 16, display: "grid", gap: 16, maxWidth: 700, margin: "0 auto" }}>
      <h2>Open Jobs</h2>
      {jobs.length === 0 && <p>No jobs available right now.</p>}
      {jobs.map((job) => (
        <div key={job.jobPostId} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: "0 0 8px" }}>{job.title}</h3>
          <p style={{ margin: "0 0 8px", color: "#555" }}>{job.descrip}</p>
          <p style={{ margin: "0 0 4px" }}>CTC: ₹{job.ctc.toLocaleString("en-IN")}</p>
          <p style={{ margin: "0 0 4px" }}>Min CGPA: {job.minCgpa}</p>
          <p style={{ margin: "0 0 4px" }}>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
          <p style={{ margin: "0 0 8px" }}>Status: {job.jobStatus}</p>

          {user?.role === "STUDENT" && job.jobStatus === "OPEN" && (
            <button onClick={() => handleApply(job.jobPostId)}>Apply</button>
          )}

          {messages[job.jobPostId] && (
            <p style={{ marginTop: 8, color: messages[job.jobPostId].includes("success") ? "green" : "red" }}>
              {messages[job.jobPostId]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}