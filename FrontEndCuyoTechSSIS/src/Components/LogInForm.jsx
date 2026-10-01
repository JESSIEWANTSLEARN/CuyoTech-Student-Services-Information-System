function LogInForm() {
    function handleSubmit(event) {
        event.preventDefault();
        // Connect this form to the agreed authentication endpoint later.
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Log in to your account</h2>
            <p className="form-note">Use the account created after your enrollment.</p>

            <label htmlFor="login-email">Email address</label>
            <input id="login-email" name="email" type="email" autoComplete="email" required />

            <label htmlFor="login-password">Password</label>
            <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
            />

            <button type="submit" className="submit-button" disabled>
                Log in (coming soon)
            </button>
            <p className="form-note">Authentication will be available after backend integration.</p>
        </form>
    );
}

export default LogInForm;
