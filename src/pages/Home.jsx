import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const [jobCount, setJobCount] = useState(null);

  useEffect(() => {
    api.get("/api/jobs", { params: { size: 1 } })
  .then((res) => setJobCount(res.data.totalElements))
  .catch(() => {});
  }, []);

  return (
    <div className="hero">
      <h1>Your placement cell, finally online.</h1>
      <p className="hero-quote">
        Every application here is tracked end to end — so you're never left wondering if anyone saw your resume.
      </p>
      <div className="hero-actions">
        <Link to="/jobs" className="btn-primary">Browse Open Roles</Link>
        <Link to="/register" className="btn-secondary">Create your account</Link>
      </div>
      {jobCount !== null && (
        <p className="hero-stat">{jobCount} role{jobCount === 1 ? "" : "s"} open right now</p>
      )}
    </div>
  );
}