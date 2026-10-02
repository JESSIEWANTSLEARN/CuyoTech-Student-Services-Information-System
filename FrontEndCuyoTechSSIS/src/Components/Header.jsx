import Nav from "./Nav.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

function Header({ section = "Student Services" }) {
    return (
        <header className="site-header">
            <Nav />
            <div className="header-actions">
                <span className="header-section">{section}</span>
                <ThemeToggle />
            </div>
        </header>
    );
}

export default Header;
