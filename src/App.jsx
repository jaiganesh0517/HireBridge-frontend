import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import CreateStudentProfile from "./pages/CreateStudentProfile";
import CreateRecruiterProfile from "./pages/CreateRecruiterProfile";
import PostJob from "./pages/PostJob";
import AddBranches from "./pages/AddBranches";
import Applicants from "./pages/Applicants";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/create-profile" element={<CreateStudentProfile />} />
        <Route path="/create-recruiter-profile" element={<CreateRecruiterProfile />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/post-job/:jobId/branches" element={<AddBranches />} />
        <Route path="/jobs/:jobId/applicants" element={<Applicants />} />
      </Routes>
    </>
  );
}