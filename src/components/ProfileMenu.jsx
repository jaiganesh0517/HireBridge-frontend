import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close the dropdown when clicking outside it
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  const initial = (user?.name || "?").charAt(0).toUpperCase();

  return (
    <div className="profile-menu" ref={ref}>
      <button className="avatar-btn" onClick={() => setOpen(!open)} aria-label="Profile menu">
        {initial}
      </button>

      {open && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            <strong>{user.name}</strong>
            <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
          </div>
          <Link to="/profile" onClick={() => setOpen(false)}>My Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}