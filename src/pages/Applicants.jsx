import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function Applicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [messages, setMessages] = useState({});

  const loadApplicants = () => {
  api.get(`/api/application/${jobId}/applicants`).then((res) => setApplicants(res.data)).catch(console.log);
};

  useEffect(() => { loadApplicants(); }, [jobId]);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await api.patch(`/api/application/${applicationId}/status/${newStatus}`);
      setMessages((prev) => ({ ...prev, [applicationId]: `Updated to ${newStatus}` }));
      loadApplicants(); // refresh so the shown status matches the DB
    } catch (err) {
      console.log(err.response);
      setMessages((prev) => ({ ...prev, [applicationId]: err.response?.data?.message || "Update failed" }));
    }
  };

  return (
    <div style={{ padding: 16, display: "grid", gap: 16, maxWidth: 700, margin: "0 auto" }}>
      <h2>Applicants for Job {jobId}</h2>
      {applicants.length === 0 && <p>No applicants yet.</p>}
      {applicants.map((a) => (
        <div key={a.applicationId} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
          <p><strong>{a.userName}</strong> — {a.branch}, CGPA {a.cgpa}</p>
          <p>Skills: {a.skills}</p>
          <p>Status: {a.status} | Applied: {new Date(a.appliedAt).toLocaleDateString()}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => updateStatus(a.applicationId, "SHORTLISTED")}>Shortlist</button>
            <button onClick={() => updateStatus(a.applicationId, "SELECTED")}>Select</button>
            <button onClick={() => updateStatus(a.applicationId, "REJECTED")}>Reject</button>
          </div>
          {messages[a.applicationId] && <p style={{ color: "green" }}>{messages[a.applicationId]}</p>}
        </div>
      ))}
    </div>
  );
}