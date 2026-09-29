import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AddBranches() {
  const { jobId } = useParams();
  const [branchInput, setBranchInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const branches = branchInput.split(",").map((b) => b.trim()).filter(Boolean);
    try {
      await api.post(`/api/jobs/${jobId}/branches`, branches);
      navigate("/jobs");
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.message || "Could not add branches.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "40px auto", display: "grid", gap: 12 }}>
      <h2>Add Eligible Branches</h2>
      <p style={{ color: "#555" }}>Job ID: {jobId}</p>
      <input
        placeholder="e.g. CSE, IT, ECE"
        value={branchInput}
        onChange={(e) => setBranchInput(e.target.value)}
      />
      <button type="submit">Save Branches</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}