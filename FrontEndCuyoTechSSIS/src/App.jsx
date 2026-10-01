import { Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";

import StudentDashboard from "./Pages/Student/StudentDashboard.jsx";

import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";

import "./App.css";

function App() {
    return (
        <Routes>
            {/* Public pages */}
            <Route path="/" element={<LandingPage />} />

            {/* Student pages */}
            <Route
                path="/student/dashboard"
                element={<StudentDashboard />}
            />

            {/* Admin pages */}
            <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
            />

            {/* Invalid URL */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;