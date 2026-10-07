import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 3;

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({});
  const { user } = useAuth();

  // what the user is typing
  const [title, setTitle] = useState("");
  const [skill, setSkill] = useState("");

  // what was actually submitted (these drive the fetch)
  const [appliedTitle, setAppliedTitle] = useState("");
  const [appliedSkill, setAppliedSkill] = useState("");

  // pagination (page is 0-based, same as the backend)
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // one fetch for everything: runs when page or applied filters change
  useEffect(() => {
    let ignore = false;   // stops an old, slower response from overwriting a newer one
    setLoading(true);

    const hasFilter = appliedTitle || appliedSkill;
    const url = hasFilter ? "/api/jobs/search" : "/api/jobs";
    const params = { page, size: PAGE_SIZE };
    if (appliedTitle) params.title = appliedTitle;
    if (appliedSkill) params.skill = appliedSkill;

    api.get(url, { params })
      .then((res) => {
        if (ignore) return;
        setJobs(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      })
      .catch(console.log)
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [page, appliedTitle, appliedSkill]);

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedTitle(title.trim());
    setAppliedSkill(skill.trim());
    setPage(0);   // a new search always starts from the first page
  };

  const handleClear = () => {
    setTitle("");
    setSkill("");
    setAppliedTitle("");
    setAppliedSkill("");
    setPage(0);
  };

  const goToPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApply = async (jobId) => {
    setMessages((prev) => ({ ...prev, [jobId]: { text: "Applying...", ok: true } }));
    try {
      await api.post(`/api/application/${jobId}/apply`);
      setMessages((prev) => ({ ...prev, [jobId]: { text: "Applied successfully!", ok: true } }));
    } catch (err) {
      const text = err.response?.data?.message || "Could not apply. Check eligibility.";
      setMessages((prev) => ({ ...prev, [jobId]: { text, ok: false } }));
    }
  };

  return (
    <div className="page stack">
      <h2>Open Jobs</h2>

      <form onSubmit={handleSearch} className="search-bar">
        <input placeholder="Search by title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Search by skill" value={skill} onChange={(e) => setSkill(e.target.value)} />
        <button type="submit">Search</button>
        {(title || skill || appliedTitle || appliedSkill) && (
          <button type="button" className="secondary" onClick={handleClear}>Clear</button>
        )}
      </form>

      {loading && <p>Loading jobs...</p>}
      {!loading && jobs.length === 0 && <p className="empty-state">No jobs match your search.</p>}

      {!loading && jobs.map((job) => (
        <div key={job.jobPostId} className="card">
          <h3>{job.title}</h3>
          <p>{job.descrip}</p>
          <p>CTC: ₹{job.ctc.toLocaleString("en-IN")} &nbsp;·&nbsp; Min CGPA: {job.minCgpa}</p>
          <p>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
          <span className={`tag tag-${job.jobStatus.toLowerCase()}`}>{job.jobStatus}</span>

          {user?.role === "STUDENT" && job.jobStatus === "OPEN" && (
            <div style={{ marginTop: 12 }}>
              <button onClick={() => handleApply(job.jobPostId)}>Apply</button>
            </div>
          )}

          {messages[job.jobPostId] && (
            <p className={messages[job.jobPostId].ok ? "success-text" : "error-text"} style={{ marginTop: 8 }}>
              {messages[job.jobPostId].text}
            </p>
          )}
        </div>
      ))}

      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button className="secondary" disabled={page === 0} onClick={() => goToPage(page - 1)}>
            ← Previous
          </button>
          <span>Page {page + 1} of {totalPages} · {totalElements} jobs</span>
          <button className="secondary" disabled={page >= totalPages - 1} onClick={() => goToPage(page + 1)}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}