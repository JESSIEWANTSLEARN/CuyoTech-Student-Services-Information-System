function SignUpForm() {
    function handleSubmit(event) {
        event.preventDefault();
        // Connect this form only if public registration is approved by the team.
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Create an account</h2>
            <p className="form-note">Student registration is awaiting team confirmation.</p>

            <label htmlFor="signup-name">Full name</label>
            <input id="signup-name" name="name" type="text" autoComplete="name" required />

            <label htmlFor="signup-email">Email address</label>
            <input id="signup-email" name="email" type="email" autoComplete="email" required />

            <label htmlFor="signup-password">Password</label>
            <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
            />

            <button type="submit" className="submit-button" disabled>
                Sign up (coming soon)
            </button>
            <p className="form-note">Registration will be enabled if self-service accounts are approved.</p>
        </form>
    );
}

export default SignUpForm;
