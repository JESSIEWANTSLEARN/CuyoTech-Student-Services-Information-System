import Nav from "./Nav.jsx";

function Header({ section = "Student Services" }) {
    return (
        <header className="site-header">
            <Nav />
            <span>{section}</span>
        </header>
    );
}

export default Header;
