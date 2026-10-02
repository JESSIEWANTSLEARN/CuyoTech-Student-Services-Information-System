import { NavLink } from "react-router-dom";

function SideBar() {
    return (
        <nav className="student-sidebar" aria-label="Student navigation">
            <NavLink to="/student/dashboard" end>Dashboard</NavLink>
            <NavLink to="/student/subjects">Subjects</NavLink>
            <NavLink to="/student/grades">Grades</NavLink>
            <NavLink to="/student/profile">Profile</NavLink>
            <NavLink to="/student/document-request">Document request</NavLink>
            <NavLink to="/student/requests">Request status</NavLink>
        </nav>
    );
}

export default SideBar;
