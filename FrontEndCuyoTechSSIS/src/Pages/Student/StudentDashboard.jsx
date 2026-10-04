import { Link } from "react-router-dom";
import Header from "../../Components/Header.jsx";
import SideBar from "../../Components/SideBar.jsx";
import Footer from "../../Components/Footer.jsx";
import StudentProfile from "../../Components/Student/StudentProfile.jsx";
import StudentSubjects from "../../Components/Student/StudentSubjects.jsx";
import StudentGrades from "../../Components/Student/StudentGrades.jsx";

function StudentDashboard() {
    return (
        <div>
            <Header />
            <div className="dashboard-layout">
                <SideBar />
                <main className="dashboard-content">
                    <p className="eyebrow">Student portal</p>
                    <h1>Student Dashboard</h1>
                    <p>
                        Access your academic records and student services in one place.
                    </p>

                    <div className="dashboard-grid">
                        <StudentProfile />
                        <StudentSubjects />
                        <StudentGrades />
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
            <Footer />
        </div>
    );
}

export default StudentDashboard;
