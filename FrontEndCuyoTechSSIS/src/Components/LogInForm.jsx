import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen.jsx";
import { apiRequest } from "../services/api.js";
import { getDashboardPath, saveAuth } from "../services/auth.js";

function LogInForm() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setLoading(true);

        const formData = new FormData(event.currentTarget);

        try {
            const data = await apiRequest("/login", {
                method: "POST",
                body: JSON.stringify({
                    email: formData.get("email"),
                    password: formData.get("password"),
                }),
            });

            saveAuth(data.token, data.user);
            navigate(getDashboardPath(data.user.role));
        } catch (error) {
            setMessage(error.message);
            setLoading(false);
        }
    }

    return (
        <>
            {loading && <LoadingScreen message="Signing you in..." />}

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-form-heading">
                    <p className="eyebrow">Secure account access</p>
                    <h2>Welcome back</h2>
                    <p className="form-note">
                        Sign in using the account provided by authorized CuyoTech staff.
                    </p>
                </div>

                <label htmlFor="login-email">Email address</label>
                <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@cuyotech.com"
                    required
                />

                <label htmlFor="login-password">Password</label>
                <div className="password-field">
                    <input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                {message && (
                    <p className="login-message" role="alert">
                        {message}
                    </p>
                )}
            </form>
        </>
    );
}

export default LogInForm;
