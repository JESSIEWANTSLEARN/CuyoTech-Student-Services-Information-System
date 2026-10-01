import { NavLink } from "react-router-dom";

function SideBar() {
    return (
        <nav className="student-sidebar" aria-label="Student navigation">
            <NavLink to="/student/dashboard" end>Dashboard</NavLink>
            <NavLink to="/student/document-request">Document request</NavLink>
        </nav>
    );
}

export default SideBar;
