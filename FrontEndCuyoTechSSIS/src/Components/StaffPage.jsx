import { Link } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const sections = {
    admin: [
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "User accounts", path: "/admin/users" },
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

function StaffPage({ role, title, description, children }) {
    return (
        <div>
            <Header section={title} />
            <main className="dashboard-content module-dashboard">
                <p className="eyebrow">{role} module</p>
                <h1>{title}</h1>
                <p>{description}</p>
                <nav className="module-nav" aria-label={`${role} pages`}>
                    {sections[role].map(({ label, path }) => (
                        <Link key={path} to={path}>{label}</Link>
                    ))}
                </nav>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default StaffPage;
