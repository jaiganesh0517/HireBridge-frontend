import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function Applicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [messages, setMessages] = useState({});
  const [title, setTitle] = useState("");

  const loadApplicants = () => {
    api.get(`/api/application/${jobId}/applicants`)
      .then((res) => setApplicants(res.data))
      .catch(console.log);
  };

  useEffect(() => {
    loadApplicants();
  }, [jobId]);

  useEffect(() => {
    api.get("/api/myJobs")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data.content;
        const job = list.find((j) => String(j.jobPostId) === jobId);
        if (job) setTitle(job.title);
      })
      .catch(console.log);
  }, [jobId]);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await api.patch(`/api/application/${applicationId}/status/${newStatus}`);
      setMessages((prev) => ({ ...prev, [applicationId]: { text: `Updated to ${newStatus}`, ok: true } }));
      loadApplicants();
    } catch (err) {
      const text = err.response?.data?.message || "Update failed";
      setMessages((prev) => ({ ...prev, [applicationId]: { text, ok: false } }));
    }
  };

  return (
    <div className="page stack">
      <h2>Applicants for {title || `Job ${jobId}`}</h2>
      {applicants.length === 0 && <p className="empty-state">No applicants yet.</p>}
      {applicants.map((a) => (
        <div key={a.applicationId} className="card">
          <h3>{a.userName}</h3>
          {a.emailId && (
            <p><a href={`mailto:${a.emailId}`}>{a.emailId}</a></p>
          )}
          <p>{a.branch} · CGPA {a.cgpa}</p>
          <p>{a.about}</p>
          <p>Skills: {a.skills}</p>
          <p>Applied: {new Date(a.appliedAt).toLocaleDateString()}</p>
          <span className={`tag tag-${a.status.toLowerCase()}`}>{a.status}</span>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={() => updateStatus(a.applicationId, "SHORTLISTED")}>Shortlist</button>
            <button onClick={() => updateStatus(a.applicationId, "SELECTED")}>Select</button>
            <button className="secondary" onClick={() => updateStatus(a.applicationId, "REJECTED")}>Reject</button>
          </div>

          {messages[a.applicationId] && (
            <p className={messages[a.applicationId].ok ? "success-text" : "error-text"} style={{ marginTop: 8 }}>
              {messages[a.applicationId].text}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}