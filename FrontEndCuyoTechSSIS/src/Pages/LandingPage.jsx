import { Link } from "react-router-dom";
import Footer from "../Components/Footer.jsx";
import LogInForm from "../Components/LogInForm.jsx";

function LandingPage() {
    return (
        <div>
            <main className="landing-page">
                <section className="welcome-panel" aria-labelledby="welcome-title">
                    <p className="eyebrow">CuyoTech University</p>
                    <h1 id="welcome-title">Student services, without the long line.</h1>
                    <p className="welcome-lead">
                        One portal for academic records, university requests, payments,
                        and clearance workflows.
                    </p>

                    <div className="service-highlights" aria-label="Available student services">
                        <div>
                            <strong>Academic records</strong>
                            <span>Subjects, grades, and profile information</span>
                        </div>
                        <div>
                            <strong>Document requests</strong>
                            <span>TOR, COR, certifications, and request status</span>
                        </div>
                        <div>
                            <strong>Role-based access</strong>
                            <span>Student and authorized university staff workspaces</span>
                        </div>
                    </div>

                    <Link className="project-info-entry-link" to="/project-info">
                        FAQ · Project Team · System Overview →
                    </Link>
                </section>

                <section className="auth-panel" aria-label="Account access">
                    <LogInForm />
                    <div className="account-help">
                        <strong>No account yet?</strong>
                        <span>
                            Student accounts are issued after enrollment. Contact authorized
                            university staff if you need account assistance.
                        </span>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default LandingPage;
