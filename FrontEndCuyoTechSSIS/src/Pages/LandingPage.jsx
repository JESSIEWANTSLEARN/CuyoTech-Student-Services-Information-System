import { useState } from "react";
import LogInForm from "../Components/LogInForm.jsx";
import SignUpForm from "../Components/SignUpForm.jsx";

function LandingPage() {
    const [selectedForm, setSelectedForm] = useState(null);

    return (
        <main className="landing-page">
            <section className="welcome-panel" aria-labelledby="welcome-title">
                <p className="eyebrow">CuyoTech University</p>
                <h1 id="welcome-title">Student Services Information System</h1>
                <p>
                    Access your student services in one place. Choose how you
                    would like to get started.
                </p>
            </section>

            <section className="auth-panel" aria-label="Account access">
                <div className="auth-options" role="group" aria-label="Choose an account action">
                    <button
                        type="button"
                        className={selectedForm === "login" ? "auth-option active" : "auth-option"}
                        aria-pressed={selectedForm === "login"}
                        onClick={() => setSelectedForm("login")}
                    >
                        Log in
                    </button>
                    <button
                        type="button"
                        className={selectedForm === "signup" ? "auth-option active" : "auth-option"}
                        aria-pressed={selectedForm === "signup"}
                        onClick={() => setSelectedForm("signup")}
                    >
                        Sign up
                    </button>
                </div>

                {selectedForm === "login" && <LogInForm />}
                {selectedForm === "signup" && <SignUpForm />}
                {selectedForm === null && (
                    <p className="auth-prompt" role="status">
                        Select Log in or Sign up to continue.
                    </p>
                )}
            </section>
        </main>
    );
}

export default LandingPage;
