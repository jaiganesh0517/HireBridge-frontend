import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notCreated, setNotCreated] = useState(false);
  const [error, setError] = useState("");

  const isStudent = user.role === "STUDENT";
  const createPath = isStudent ? "/create-profile" : "/create-recruiter-profile";

  useEffect(() => {
    const url = isStudent ? "/api/students/profile" : "/api/recruiter/profile";
    api.get(url)
      .then((res) => setProfile(res.data))
      .catch((err) => {
        if (err.response?.status === 404) setNotCreated(true);
        else setError(err.response?.data?.message || "Could not load profile");
      })
      .finally(() => setLoading(false));
  }, [isStudent]);

  if (loading) return <div className="page"><p>Loading...</p></div>;

  if (notCreated) {
    return (
      <div className="page">
        <div className="card empty-state">
          <p>You haven't created your profile yet.</p>
          <Link to={createPath} className="btn-primary">Create profile</Link>
        </div>
      </div>
    );
  }

  if (error) return <div className="page"><p className="error-text">{error}</p></div>;

  return (
    <div className="page">
      <div className="card stack">
        <div className="profile-header">
  <div className="avatar-lg">{profile.userName.charAt(0).toUpperCase()}</div>
  <div style={{ flex: 1 }}>
    <h2>{profile.userName}</h2>
    <p>{profile.emailId}</p>
  </div>
  <Link to="/edit-profile" className="btn-secondary">Edit profile</Link>
</div>

        {isStudent ? (
          <>
            <p><strong>Branch:</strong> {profile.branch}</p>
            <p><strong>CGPA:</strong> {profile.cgpa}</p>
            <p><strong>Batch:</strong> {profile.batchYear}</p>
            <p><strong>About:</strong> {profile.about}</p>
            <div>
              <strong>Skills:</strong>
              <div className="skill-list">
                {profile.skills?.split(",").map((s) => (
                  <span key={s} className="skill-chip">{s.trim()}</span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <p><strong>Company:</strong> {profile.companyName}</p>
            <p><strong>Designation:</strong> {profile.designation}</p>
            <p><strong>Summary:</strong> {profile.summary}</p>
          </>
        )}
      </div>
    </div>
  );
}