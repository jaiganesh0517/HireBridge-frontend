import { useState } from "react";
import api from "../api/axios";

// Pass either applicationId (applications) or nothing (student's own default resume)
export default function ViewResumeButton({ applicationId, label = "View resume" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const url = applicationId
  ? `/api/application/${applicationId}/resume`
  : "/api/students/resume";

  const handleClick = async () => {
    setError("");
    setLoading(true);
    // open the tab first, so the popup blocker doesn't stop it after the async call
    const tab = window.open("", "_blank");
    try {
      const res = await api.get(url);
      if (tab) tab.location.href = res.data.url;
      else window.location.href = res.data.url;
    } catch (err) {
      if (tab) tab.close();
      setError(err.response?.data?.message || "Could not open resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <span>
      <button type="button" className="btn-secondary" onClick={handleClick} disabled={loading}>
        {loading ? "Opening..." : label}
      </button>
      {error && <span className="error-text"> {error}</span>}
    </span>
  );
}