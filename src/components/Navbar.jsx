import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/jobs" className="brand">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <path d="M3 17 Q13 5 23 17" stroke="#C8963E" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <circle cx="3" cy="17" r="2.5" fill="#1B2430"/>
          <circle cx="23" cy="17" r="2.5" fill="#1B2430"/>
        </svg>
        HireBridge
      </Link>

      <div className="nav-links">
        <NavLink to="/jobs" className={({ isActive }) => (isActive ? "active" : "")}>Jobs</NavLink>
        {!user && <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>Login</NavLink>}
        {!user && <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>Register</NavLink>}

        {user?.role === "STUDENT" && (
          <NavLink to="/my-applications" className={({ isActive }) => (isActive ? "active" : "")}>My Applications</NavLink>
        )}

        {user?.role === "RECRUITER" && (
          <>
            <NavLink to="/post-job" className={({ isActive }) => (isActive ? "active" : "")}>Post Job</NavLink>
            <NavLink to="/my-posted-jobs" className={({ isActive }) => (isActive ? "active" : "")}>My Posted Jobs</NavLink>
          </>
        )}
      </div>

      {user && <ProfileMenu />}
    </nav>
  );
}