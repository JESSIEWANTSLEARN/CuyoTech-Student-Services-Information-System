import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton.jsx";
import Nav from "./Nav.jsx";
import NotificationBell from "./NotificationBell.jsx";
import { PortalIdentity } from "./PortalContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const roleLabels = {
    student: "Student Portal",
    admin: "Admin",
    registrar: "Registrar",
    cashier: "Cashier",
    department: "Department",
};

function Header({ section = "Student Services" }) {
    const { pathname } = useLocation();
    const role = pathname.split("/")[1] || "student";
    const isLandingPage = pathname === "/";

    return (
        <header className={`site-header${isLandingPage ? " landing-header" : ""}`}>
            <div className="header-brand-area">
                <Nav />
                {!isLandingPage && (
                    <span className="role-context">
                        {roleLabels[role] || section}
                    </span>
                )}
            </div>

            <div className="header-actions">
                <Link className="header-project-link" to="/project-info">
                    FAQ & Team
                </Link>

                {isLandingPage ? (
                    <span className="header-section">{section}</span>
                ) : (
                    <>
                        <PortalIdentity />
                        <NotificationBell />
                        <LogoutButton />
                    </>
                )}
                {!isLandingPage && <ThemeToggle />}
            </div>
        </header>
    );
}

export default Header;
