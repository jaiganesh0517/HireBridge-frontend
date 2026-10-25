import { useRef, useState } from "react";
import api from "../api/axios";
import ViewResumeButton from "./ViewResumeButton";

const MAX_BYTES = 2 * 1024 * 1024;

function formatSize(bytes) {
  if (bytes == null) return "";
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResumeSection({ profile, onUpdated }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const hasResume = !!profile.resumeFileName;

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Resume must be 2 MB or smaller");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await api.post("/api/students/resume", formData);
      onUpdated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="stack">
      <strong>Resume</strong>

      {hasResume ? (
  <>
    <p>
      {profile.resumeFileName} ({formatSize(profile.resumeSize)}), uploaded{" "}
      {new Date(profile.resumeUploadedAt).toLocaleDateString()}
    </p>
    <ViewResumeButton />
  </>
) : (
  <p>No resume uploaded yet.</p>
)}

      <label className="btn-secondary" style={{ cursor: uploading ? "not-allowed" : "pointer" }}>
        {uploading ? "Uploading..." : hasResume ? "Replace resume" : "Upload resume (PDF, max 2 MB)"}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleChange}
          disabled={uploading}
          style={{ display: "none" }}
        />
      </label>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}