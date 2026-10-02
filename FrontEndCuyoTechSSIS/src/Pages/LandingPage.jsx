import LogInForm from "../Components/LogInForm.jsx";
import Footer from "../Components/Footer.jsx";

function LandingPage() {
    return (
        <div>
            <main className="landing-page">
                <section className="welcome-panel" aria-labelledby="welcome-title">
                    <p className="eyebrow">CuyoTech University</p>
                    <h1 id="welcome-title">Student Services Information System</h1>
                    <p>
                        Access your student services in one place. Enrolled students
                        can use the account provided after enrollment.
                    </p>
                </section>

                <section className="auth-panel" aria-label="Account access">
                    <LogInForm />
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default LandingPage;
