import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import CreateStudentProfile from "./pages/CreateStudentProfile";
import CreateRecruiterProfile from "./pages/CreateRecruiterProfile";
import PostJob from "./pages/PostJob";
import AddBranches from "./pages/AddBranches";
import Applicants from "./pages/Applicants";
import MyApplications from "./pages/MyApplications";
import MyPostedJobs from "./pages/MyPostedJobs";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

export default function App() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/create-profile" element={<CreateStudentProfile />} />
        <Route path="/create-recruiter-profile" element={<CreateRecruiterProfile />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/post-job/:jobId/branches" element={<AddBranches />} />
        <Route path="/jobs/:jobId/applicants" element={<Applicants />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/my-posted-jobs" element={<MyPostedJobs />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      </Routes>
      </main>
      <Footer />
    </>
  );
}