import { Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage.jsx";
import Header from "./Components/Header.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";

import StudentDashboard from "./Pages/Student/StudentDashboard.jsx";
import DocumentRequest from "./Pages/Student/DocumentRequest.jsx";
import StudentProfilePage from "./Pages/Student/StudentProfilePage.jsx";
import StudentSubjectsPage from "./Pages/Student/StudentSubjectsPage.jsx";
import StudentGradesPage from "./Pages/Student/StudentGradesPage.jsx";
import StudentRequests from "./Pages/Student/StudentRequests.jsx";

import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";
import UserAccounts from "./Pages/Admin/UserAccounts.jsx";

import RegistrarDashboard from "./Pages/Registrar/RegistrarDashboard.jsx";
import Enrollment from "./Pages/Registrar/Enrollment.jsx";
import GradeEncoding from "./Pages/Registrar/GradeEncoding.jsx";
import RegistrarDocumentRequests from "./Pages/Registrar/DocumentRequests.jsx";

import CashierDashboard from "./Pages/Cashier/CashierDashboard.jsx";
import Payments from "./Pages/Cashier/Payments.jsx";
import Receipts from "./Pages/Cashier/Receipts.jsx";

import DepartmentDashboard from "./Pages/Department/DepartmentDashboard.jsx";
import Clearance from "./Pages/Department/Clearance.jsx";

import "./App.css";

function App() {
    return (
        <Routes>
            {/* Public pages */}
            <Route path="/" element={<><Header section="Student portal" /><LandingPage /></>} />

            {/* Student pages */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/document-request" element={<DocumentRequest />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            <Route path="/student/subjects" element={<StudentSubjectsPage />} />
            <Route path="/student/grades" element={<StudentGradesPage />} />
            <Route path="/student/requests" element={<StudentRequests />} />

            {/* Admin pages */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserAccounts />} />

            {/* Registrar pages */}
            <Route path="/registrar/dashboard" element={<RegistrarDashboard />} />
            <Route path="/registrar/enrollment" element={<Enrollment />} />
            <Route path="/registrar/grades" element={<GradeEncoding />} />
            <Route path="/registrar/document-requests" element={<RegistrarDocumentRequests />} />

            {/* Cashier pages */}
            <Route path="/cashier/dashboard" element={<CashierDashboard />} />
            <Route path="/cashier/payments" element={<Payments />} />
            <Route path="/cashier/receipts" element={<Receipts />} />

            {/* Department pages */}
            <Route path="/department/dashboard" element={<DepartmentDashboard />} />
            <Route path="/department/clearance" element={<Clearance />} />

            {/* Invalid URL */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
