import Nav from "./Nav.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { useLocation } from "react-router-dom";
import AccountBadge from "./AccountBadge.jsx";

function Header({ section = "Student Services", account = null }) {
    const { pathname } = useLocation();
    const role = pathname.split("/")[1] || "student";

    return (
        <header className="site-header">
            <Nav />
            <div className="header-actions">
                {pathname === "/" ? (
                    <span className="header-section">{section}</span>
                ) : (
                    <AccountBadge role={role} account={account} />
                )}
                <ThemeToggle />
            </div>
        </header>
    );
}

export default Header;
