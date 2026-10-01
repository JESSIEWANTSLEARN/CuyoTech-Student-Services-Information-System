import { Link } from "react-router-dom";
import Header from "../../Components/Header.jsx";
import SideBar from "../../Components/SideBar.jsx";

function StudentDashboard() {
    return (
        <>
            <Header />
            <div className="dashboard-layout">
                <SideBar />
                <main className="dashboard-content">
                    <p className="eyebrow">Student portal</p>
                    <h1>Student Dashboard</h1>
                    <p>
                        View your student services here after you log in.
                    </p>

                    <div className="dashboard-grid">
                        <section className="dashboard-card">
                            <h2>Profile</h2>
                            <p>Your student profile will appear here when connected to the university records.</p>
                        </section>
                        <section className="dashboard-card">
                            <h2>Subjects and grades</h2>
                            <p>Your enrolled subjects and released grades will appear here.</p>
                        </section>
                        <section className="dashboard-card">
                            <h2>Document requests</h2>
                            <p>Submit a request for a TOR, COR, or certification.</p>
                            <Link to="/student/document-request" className="action-link">
                                Request a document
                            </Link>
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}

export default StudentDashboard;
