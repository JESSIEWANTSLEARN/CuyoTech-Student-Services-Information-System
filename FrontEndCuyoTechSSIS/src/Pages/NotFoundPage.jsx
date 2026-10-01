import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <main className="placeholder-page">
            <h1>Page not found</h1>
            <p>The page you requested does not exist.</p>
            <Link to="/">Return to the landing page</Link>
        </main>
    );
}

export default NotFoundPage;
