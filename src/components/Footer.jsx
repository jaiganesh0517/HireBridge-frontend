import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <strong>HireBridge</strong>
          <p>A placement portal connecting students to real opportunities.</p>
        </div>
        <div>
          <p className="footer-heading">Explore</p>
          <Link to="/jobs">Browse Jobs</Link>
          <Link to="/register">Create an Account</Link>
        </div>
        <div>
          <p className="footer-heading">Contact</p>
          <p>support@hirebridge.app</p>
        </div>
      </div>
      <p className="footer-bottom">© {new Date().getFullYear()} HireBridge. Built by Jai Ganesh.</p>
    </footer>
  );
}