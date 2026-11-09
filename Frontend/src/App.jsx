import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ManageAccountsPage from "./pages/ManageAccountsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex flex-1 flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/admin" element={<AdminDashboard />} />

            <Route
              path="/admin/manage-accounts"
              element={<ManageAccountsPage />}
            />

            <Route
              path="/employerdashboard"
              element={<EmployerDashboard />}
            />

            <Route
              path="/employer"
              element={<EmployerDashboard />}
            />

            <Route
              path="/post-job"
              element={<EmployerDashboard initialTab="Post a Job" />}
            />

            <Route
              path="/reports-complaints"
              element={
                <EmployerDashboard initialTab="Reports & Complaints" />
              }
            />

            <Route
              path="/jobseekerdashboard"
              element={<JobSeekerDashboard />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}