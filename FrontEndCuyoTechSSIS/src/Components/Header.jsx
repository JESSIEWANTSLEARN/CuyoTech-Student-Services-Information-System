import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="site-header">
            <Link to="/" className="brand-link">CuyoTech SSIS</Link>
            <span>Student Services</span>
        </header>
    );
}

export default Header;
