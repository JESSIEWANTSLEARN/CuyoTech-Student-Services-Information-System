import { Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";

import StudentDashboard from "./Pages/Student/StudentDashboard.jsx";
import DocumentRequest from "./Pages/Student/DocumentRequest.jsx";

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
            <Route
                path="/student/document-request"
                element={<DocumentRequest />}
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
