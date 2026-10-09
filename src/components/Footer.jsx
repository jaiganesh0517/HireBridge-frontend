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
          <p className="footer-contact">Contact</p>
          <a href="mailto:jaiganesh0517@gmail.com">Email</a>
          <a href="https://github.com/jaiganesh0517" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
      <p className="footer-bottom">© {new Date().getFullYear()} HireBridge. Built by Jaiganesh.</p>
    </footer>
  );
}