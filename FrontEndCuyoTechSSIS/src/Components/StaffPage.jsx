import { NavLink } from "react-router-dom";
import { AcademicTermCard } from "./PortalContext.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

const sections = {
    admin: [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "User accounts", path: "/admin/users" },
        { label: "Notices & dates", path: "/admin/content" },
        { label: "System portals", path: "/admin/system-portals" },
        { label: "Audit logs", path: "/admin/audit-logs" },
    ],
    registrar: [
        { label: "Dashboard", path: "/registrar/dashboard" },
        { label: "Enrollment", path: "/registrar/enrollment" },
        { label: "Grade encoding", path: "/registrar/grades" },
        { label: "Document requests", path: "/registrar/document-requests" },
    ],
    cashier: [
        { label: "Dashboard", path: "/cashier/dashboard" },
        { label: "Payments", path: "/cashier/payments" },
        { label: "Receipts", path: "/cashier/receipts" },
    ],
    department: [
        { label: "Dashboard", path: "/department/dashboard" },
        { label: "Clearance", path: "/department/clearance" },
    ],
};

const roleNames = {
    admin: "Administration",
    registrar: "Registrar",
    cashier: "Cashier",
    department: "Department",
};

function StaffPage({ role, title, description, children }) {
    return (
        <div>
            <Header section={title} />
            <main className="dashboard-content module-dashboard">
                <nav className="module-nav" aria-label={`${role} pages`}>
                    <div className="sidebar-heading">
                        <span>{roleNames[role] || role}</span>
                        <small>University services</small>
                    </div>

                    <AcademicTermCard compact />

                    {sections[role].map(({ label, path }) => (
                        <NavLink key={path} to={path} end={path.endsWith("/dashboard")}>
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="module-main">
                    <div className="page-heading">
                        <p className="eyebrow">{roleNames[role] || role}</p>
                        <h1>{title}</h1>
                        <p>{description}</p>
                    </div>
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default StaffPage;
