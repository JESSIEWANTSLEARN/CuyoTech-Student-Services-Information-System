import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header.jsx";
import LoadingScreen from "../../Components/LoadingScreen.jsx";
import { apiRequest } from "../../services/api.js";

function ProfileVerification() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        apiRequest("/student/profile-verification")
            .then((response) => {
                if (response.verified) {
                    navigate("/student/dashboard", { replace: true });
                    return;
                }

                setData(response.student);
            })
            .catch((error) => setMessage(error.message))
            .finally(() => setLoading(false));
    }, [navigate]);

    async function confirmProfile() {
        setConfirming(true);
        setMessage("");

        try {
            await apiRequest("/student/profile-verification/confirm", {
                method: "POST",
            });

            navigate("/student/dashboard", { replace: true });
        } catch (error) {
            setMessage(error.message);
            setConfirming(false);
        }
    }

    if (loading) {
        return <LoadingScreen message="Loading your student information..." />;
    }

    return (
        <div className="verification-page">
            <Header section="Profile Verification" />

            <main className="verification-shell">
                <section className="verification-card">
                    <div className="verification-heading">
                        <span className="verification-step">FIRST LOGIN</span>
                        <h1>Verify your student profile</h1>
                        <p>
                            Please confirm that the information below matches your official
                            university record before continuing to the Student Portal.
                        </p>
                    </div>

                    {data && (
                        <div className="verification-grid">
                            <VerificationItem label="Student Number" value={data.student_number} />
                            <VerificationItem label="Name" value={`${data.first_name} ${data.last_name}`} />
                            <VerificationItem label="Email Address" value={data.email} />
                            <VerificationItem label="Course / Program" value={data.course_name || data.course_code || "Not assigned yet"} />
                            <VerificationItem label="Year Level" value={data.year_level ? `Year ${data.year_level}` : "Not assigned yet"} />
                            <VerificationItem label="Department" value={data.department || "Not assigned yet"} />
                            <VerificationItem label="Academic Year" value={data.academic_year || "Not assigned yet"} />
                            <VerificationItem label="Semester" value={data.semester || "Not assigned yet"} />
                        </div>
                    )}

                    <div className="verification-notice">
                        <strong>Is something incorrect?</strong>
                        <span>
                            Do not confirm incorrect information. Contact the Registrar or
                            authorized school staff so they can correct your official record.
                        </span>
                    </div>

                    {message && <p className="workflow-message error">{message}</p>}

                    <div className="verification-actions">
                        <button
                            type="button"
                            className="submit-button"
                            onClick={confirmProfile}
                            disabled={confirming || !data}
                        >
                            {confirming ? "Confirming..." : "Information is correct"}
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

function VerificationItem({ label, value }) {
    return (
        <div className="verification-item">
            <span>{label}</span>
            <strong>{value || "—"}</strong>
        </div>
    );
}

export default ProfileVerification;
