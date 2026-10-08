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
    <>
      <div className="hero">
        <h1>Bridge the gap between talent and opportunity.</h1>
<p className="hero-quote">
  Students apply to roles they're eligible for. Recruiters review,
  shortlist and select, all in one place.
</p>
        <div className="hero-actions">
          <Link to="/jobs" className="btn-primary">Browse Open Roles</Link>
          <Link to="/register" className="btn-secondary">Create your account</Link>
        </div>
        {jobCount !== null && (
          <p className="hero-stat">
            {jobCount} role{jobCount === 1 ? "" : "s"} listed right now
          </p>
        )}
      </div>

      <section className="home-section">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step-card">
            <span className="step-num">1</span>
            <h3>Build your profile</h3>
            <p>Add your branch, CGPA and skills once. Recruiters see exactly what you list.</p>
          </div>
          <div className="step-card">
            <span className="step-num">2</span>
            <h3>Apply to eligible roles</h3>
            <p>Eligibility rules (CGPA, branch, deadline) are checked for you before you apply.</p>
          </div>
          <div className="step-card">
            <span className="step-num">3</span>
            <h3>Track every stage</h3>
            <p>Watch your status move from Applied to Shortlisted to Selected, in one place.</p>
          </div>
        </div>
      </section>

      <section className="home-section">
        <h2>Built for both sides</h2>
        <div className="role-grid">
          <div className="role-card">
            <h3>For students</h3>
            <ul>
              <li>Search jobs by title or skill</li>
              <li>Apply in one click</li>
              <li>Follow application status live</li>
            </ul>
            <Link to="/register" className="btn-secondary">Join as a student</Link>
          </div>
          <div className="role-card">
            <h3>For recruiters</h3>
            <ul>
              <li>Post jobs with CGPA and branch criteria</li>
              <li>Review applicants for each role</li>
              <li>Shortlist, select or reject in a click</li>
            </ul>
            <Link to="/register" className="btn-secondary">Join as a recruiter</Link>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <h2>Ready to find your first role?</h2>
        <Link to="/register" className="btn-primary">Get started</Link>
      </section>
    </>
  );
}