import { Link } from "react-router-dom";

function Nav() {
    return (
        <nav aria-label="Primary navigation">
            <Link to="/" className="brand-link">
                <strong>CuyoTech College of Science and Technology</strong>
                <span>Student Services Information System</span>
            </Link>
        </nav>
    );
}

export default Nav;
