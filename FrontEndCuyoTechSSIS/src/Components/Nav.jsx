import { Link } from "react-router-dom";

function Nav() {
    return (
        <nav aria-label="Primary navigation">
            <Link to="/" className="brand-link">CuyoTech SSIS</Link>
        </nav>
    );
}

export default Nav;
