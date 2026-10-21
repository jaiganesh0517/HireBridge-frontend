import { useEffect, useState } from "react";
import api from "../api/axios";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState({});

  useEffect(() => {
    let ignore = false;

    api
      .get("/api/saved-jobs")
      .then((res) => {
        if (ignore) return;
        setJobs(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        if (ignore) return;
        console.log(err);
        setError("Could not load saved jobs.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function handleUnsave(jobPostId) {
    const previous = jobs;
    setJobs((current) => current.filter((job) => job.jobPostId !== jobPostId));
    try {
      await api.delete(`/api/saved-jobs/${jobPostId}`);
    } catch (err) {
      console.log(err);
      setJobs(previous);
    }
  }

  async function handleApply(jobPostId) {
    setMessages((prev) => ({
      ...prev,
      [jobPostId]: { text: "Applying...", ok: true },
    }));
    try {
      await api.post(`/api/application/${jobPostId}/apply`);
      setMessages((prev) => ({
        ...prev,
        [jobPostId]: { text: "Applied successfully!", ok: true },
      }));
    } catch (err) {
      const text =
        err.response?.data?.message || "Could not apply. Check eligibility.";
      setMessages((prev) => ({
        ...prev,
        [jobPostId]: { text, ok: false },
      }));
    }
  }

  return (
    <div className="page stack">
      <h2>Saved jobs</h2>

      {loading && <p>Loading saved jobs...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && jobs.length === 0 && (
        <p className="empty-state">You have not saved any jobs yet.</p>
      )}

      {!loading &&
        jobs.map((job) => (
          <div key={job.jobPostId} className="card">
            <h3>{job.title}</h3>
            <p>{job.descrip}</p>
            <p>
              CTC: ₹{job.ctc.toLocaleString("en-IN")} &nbsp;·&nbsp; Min CGPA:{" "}
              {job.minCgpa}
            </p>
            <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
            <span className={`tag tag-${job.jobStatus.toLowerCase()}`}>
              {job.jobStatus}
            </span>

            <div className="card-actions">
              {job.jobStatus === "OPEN" && (
                <button
                  type="button"
                  onClick={() => handleApply(job.jobPostId)}
                >
                  Apply
                </button>
              )}
              <button
                type="button"
                className="bookmark-btn"
                onClick={() => handleUnsave(job.jobPostId)}
              >
                Unsave
              </button>
            </div>

            {messages[job.jobPostId] && (
              <p
                className={
                  messages[job.jobPostId].ok ? "success-text" : "error-text"
                }
                style={{ marginTop: 8 }}
              >
                {messages[job.jobPostId].text}
              </p>
            )}
          </div>
        ))}
    </div>
  );
}