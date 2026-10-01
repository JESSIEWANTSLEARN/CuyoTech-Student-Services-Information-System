import { Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";

import StudentDashboard from "./Pages/Student/StudentDashboard.jsx";
import DocumentRequest from "./Pages/Student/DocumentRequest.jsx";

import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";
import RegistrarDashboard from "./Pages/Registrar/RegistrarDashboard.jsx";
import CashierDashboard from "./Pages/Cashier/CashierDashboard.jsx";
import DepartmentDashboard from "./Pages/Department/DepartmentDashboard.jsx";

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
            <Route path="/registrar/dashboard" element={<RegistrarDashboard />} />
            <Route path="/cashier/dashboard" element={<CashierDashboard />} />
            <Route path="/department/dashboard" element={<DepartmentDashboard />} />

            {/* Invalid URL */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
