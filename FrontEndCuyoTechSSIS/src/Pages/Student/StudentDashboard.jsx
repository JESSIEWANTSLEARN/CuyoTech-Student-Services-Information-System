import { Link } from "react-router-dom";
import Footer from "../../Components/Footer.jsx";
import Header from "../../Components/Header.jsx";
import { DashboardMetrics, PortalInformation } from "../../Components/PortalHomeSections.jsx";
import SideBar from "../../Components/SideBar.jsx";
import StudentGrades from "../../Components/Student/StudentGrades.jsx";
import StudentProfile from "../../Components/Student/StudentProfile.jsx";
import StudentSubjects from "../../Components/Student/StudentSubjects.jsx";
import { useApiData } from "../../hooks/useApiData.js";

const quickActions = [
    { title: "View grades", description: "Check released grades and academic results.", path: "/student/grades" },
    { title: "View subjects", description: "Review your current subject records.", path: "/student/subjects" },
    { title: "Request a document", description: "Submit a TOR, COR, or certification request.", path: "/student/document-request" },
    { title: "Track requests", description: "See the latest status of submitted requests.", path: "/student/requests" },
];

function StudentDashboard() {
    const { data } = useApiData("/portal/context", null);
    const context = data?.context;
    const firstName = context?.display_name?.split(" ")?.[0] || "Student";

    return (
        <div>
            <Header section="Student Dashboard" />
            <div className="dashboard-layout">
                <SideBar />
                <main className="dashboard-content">
                    <div className="student-welcome-banner">
                        <div>
                            <p className="eyebrow">Student services</p>
                            <h1>Welcome back, {firstName}</h1>
                            <p>
                                {context?.course || "Student"}{context?.year_level ? ` · Year ${context.year_level}` : ""}
                                {context?.semester ? ` · ${context.semester}` : ""}
                                {context?.academic_year ? ` · A.Y. ${context.academic_year}` : ""}
                            </p>
                        </div>
                        <span className="enrollment-chip">Student Portal</span>
                    </div>

                    <DashboardMetrics />

                    <section className="dashboard-section" aria-labelledby="student-actions">
                        <div className="section-heading-row">
                            <div>
                                <p className="section-kicker">Quick access</p>
                                <h2 id="student-actions">What do you need today?</h2>
                            </div>
                        </div>

                        <div className="dashboard-grid task-grid">
                            {quickActions.map((action) => (
                                <Link className="dashboard-card task-card" key={action.path} to={action.path}>
                                    <div>
                                        <h3>{action.title}</h3>
                                        <p>{action.description}</p>
                                    </div>
                                    <span className="task-card-action" aria-hidden="true">Open →</span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="dashboard-section" aria-labelledby="student-overview">
                        <div className="section-heading-row">
                            <div>
                                <p className="section-kicker">Overview</p>
                                <h2 id="student-overview">Your academic information</h2>
                            </div>
                        </div>

                        <div className="dashboard-grid overview-grid">
                            <StudentProfile />
                            <StudentSubjects />
                            <StudentGrades />
                        </div>
                    </section>

                    <PortalInformation />
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default StudentDashboard;
