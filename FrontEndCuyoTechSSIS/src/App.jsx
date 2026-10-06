import { Route, Routes } from "react-router-dom";

import Header from "./Components/Header.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import StudentVerificationGuard from "./Components/StudentVerificationGuard.jsx";
import LandingPage from "./Pages/LandingPage.jsx";
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import ProjectInfo from "./Pages/ProjectInfo.jsx";

import DocumentRequest from "./Pages/Student/DocumentRequest.jsx";
import ProfileVerification from "./Pages/Student/ProfileVerification.jsx";
import StudentDashboard from "./Pages/Student/StudentDashboard.jsx";
import StudentGradesPage from "./Pages/Student/StudentGradesPage.jsx";
import StudentProfilePage from "./Pages/Student/StudentProfilePage.jsx";
import StudentRequests from "./Pages/Student/StudentRequests.jsx";
import StudentSubjectsPage from "./Pages/Student/StudentSubjectsPage.jsx";

import AdminContent from "./Pages/Admin/AdminContent.jsx";
import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";
import AuditLogs from "./Pages/Admin/AuditLogs.jsx";
import SystemPortals from "./Pages/Admin/SystemPortals.jsx";
import UserAccounts from "./Pages/Admin/UserAccounts.jsx";

import Enrollment from "./Pages/Registrar/Enrollment.jsx";
import GradeEncoding from "./Pages/Registrar/GradeEncoding.jsx";
import RegistrarDashboard from "./Pages/Registrar/RegistrarDashboard.jsx";
import RegistrarDocumentRequests from "./Pages/Registrar/DocumentRequests.jsx";

import CashierDashboard from "./Pages/Cashier/CashierDashboard.jsx";
import Payments from "./Pages/Cashier/Payments.jsx";
import Receipts from "./Pages/Cashier/Receipts.jsx";

import Clearance from "./Pages/Department/Clearance.jsx";
import DepartmentDashboard from "./Pages/Department/DepartmentDashboard.jsx";

import "./App.css";
import "./landing-campus.css";
import "./admin.css";
import "./workflow.css";
import "./portal-experience.css";
import "./loading.css";
import "./verification.css";
import "./project-info.css";

function Guard({ roles, children }) {
    return (
        <ProtectedRoute allowedRoles={roles}>
            {children}
        </ProtectedRoute>
    );
}

function StudentGuard({ children }) {
    return (
        <Guard roles={["student"]}>
            <StudentVerificationGuard>
                {children}
            </StudentVerificationGuard>
        </Guard>
    );
}

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <>
                        <Header section="Student portal" />
                        <LandingPage />
                    </>
                }
            />

            <Route path="/project-info" element={<ProjectInfo />} />

            <Route path="/student/verify-profile" element={<Guard roles={["student"]}><ProfileVerification /></Guard>} />

            <Route path="/student/dashboard" element={<StudentGuard><StudentDashboard /></StudentGuard>} />
            <Route path="/student/document-request" element={<StudentGuard><DocumentRequest /></StudentGuard>} />
            <Route path="/student/profile" element={<StudentGuard><StudentProfilePage /></StudentGuard>} />
            <Route path="/student/subjects" element={<StudentGuard><StudentSubjectsPage /></StudentGuard>} />
            <Route path="/student/grades" element={<StudentGuard><StudentGradesPage /></StudentGuard>} />
            <Route path="/student/requests" element={<StudentGuard><StudentRequests /></StudentGuard>} />

            <Route path="/admin/dashboard" element={<Guard roles={["admin"]}><AdminDashboard /></Guard>} />
            <Route path="/admin/users" element={<Guard roles={["admin"]}><UserAccounts /></Guard>} />
            <Route path="/admin/content" element={<Guard roles={["admin"]}><AdminContent /></Guard>} />
            <Route path="/admin/system-portals" element={<Guard roles={["admin"]}><SystemPortals /></Guard>} />
            <Route path="/admin/system-portals/:role" element={<Guard roles={["admin"]}><SystemPortals /></Guard>} />
            <Route path="/admin/audit-logs" element={<Guard roles={["admin"]}><AuditLogs /></Guard>} />

            <Route path="/registrar/dashboard" element={<Guard roles={["registrar"]}><RegistrarDashboard /></Guard>} />
            <Route path="/registrar/enrollment" element={<Guard roles={["registrar"]}><Enrollment /></Guard>} />
            <Route path="/registrar/grades" element={<Guard roles={["registrar"]}><GradeEncoding /></Guard>} />
            <Route path="/registrar/document-requests" element={<Guard roles={["registrar"]}><RegistrarDocumentRequests /></Guard>} />

            <Route path="/cashier/dashboard" element={<Guard roles={["cashier"]}><CashierDashboard /></Guard>} />
            <Route path="/cashier/payments" element={<Guard roles={["cashier"]}><Payments /></Guard>} />
            <Route path="/cashier/receipts" element={<Guard roles={["cashier"]}><Receipts /></Guard>} />

            <Route path="/department/dashboard" element={<Guard roles={["department"]}><DepartmentDashboard /></Guard>} />
            <Route path="/department/clearance" element={<Guard roles={["department"]}><Clearance /></Guard>} />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
