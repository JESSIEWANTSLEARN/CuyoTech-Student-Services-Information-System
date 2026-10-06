import { Link } from "react-router-dom";
import Footer from "../Components/Footer.jsx";
import LogInForm from "../Components/LogInForm.jsx";

function LandingPage() {
    return (
        <div className="landing-shell">
            <main className="landing-page">
                <section className="welcome-panel" aria-labelledby="welcome-title">
                    <p className="eyebrow">CuyoTech College of Science and Technology</p>
                    <h1 id="welcome-title">Student services, one secure portal.</h1>
                    <p className="welcome-lead">
                        Access academic records, university requests, payments, and
                        clearance workflows from one official student services system.
                    </p>

                    <div className="service-highlights" aria-label="Available student services">
                        <div>
                            <strong>Academic records</strong>
                            <span>Subjects, released grades, enrollment, and profile information</span>
                        </div>
                        <div>
                            <strong>Document requests</strong>
                            <span>TOR, COR, certifications, payment, and request tracking</span>
                        </div>
                        <div>
                            <strong>Role-based access</strong>
                            <span>Student, Registrar, Cashier, Department, and Admin workspaces</span>
                        </div>
                    </div>

                    <Link className="project-info-entry-link" to="/project-info">
                        FAQ · Project Team · System Overview →
                    </Link>
                </section>

                <section className="auth-panel" aria-label="Account access">
                    <LogInForm />
                    <div className="account-help">
                        <strong>No public sign-up</strong>
                        <span>
                            Student accounts are issued after enrollment. Contact authorized
                            school staff if you need account assistance.
                        </span>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default LandingPage;
