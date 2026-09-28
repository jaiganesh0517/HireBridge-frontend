import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: 16, padding: 16, borderBottom: "1px solid #ddd" }}>
      <strong>HireBridge</strong>
      <Link to="/jobs">Jobs</Link>
      {!user && <Link to="/login">Login</Link>}
      {!user && <Link to="/register">Register</Link>}
      {user && <span>({user.role})</span>}
      {user && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
}