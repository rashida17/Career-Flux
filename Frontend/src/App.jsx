import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import EmployerDashboard from "./pages/EmployerDashboard";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/login" element={<Login />} /> */}
         <Route path="/employerdashboard" element={<EmployerDashboard />} /> 
      </Routes>
    </BrowserRouter>
  );
}
