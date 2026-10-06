import { NavLink } from "react-router-dom";
import { AcademicTermCard } from "./PortalContext.jsx";

const studentLinks = [
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "Profile", path: "/student/profile" },
    { label: "Subjects", path: "/student/subjects" },
    { label: "Grades", path: "/student/grades" },
    { label: "Request a document", path: "/student/document-request" },
    { label: "Request status", path: "/student/requests" },
];

function SideBar() {
    return (
        <nav className="student-sidebar" aria-label="Student navigation">
            <div className="sidebar-heading">
                <span>Student services</span>
                <small>Your academic workspace</small>
            </div>

            <AcademicTermCard compact />

            <div className="sidebar-link-group">
                {studentLinks.slice(0, 4).map((item) => (
                    <NavLink key={item.path} to={item.path} end={item.path.endsWith("/dashboard")}>
                        {item.label}
                    </NavLink>
                ))}
            </div>

            <div className="sidebar-group-label">Documents</div>

            <div className="sidebar-link-group">
                {studentLinks.slice(4).map((item) => (
                    <NavLink key={item.path} to={item.path}>
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}

export default SideBar;
