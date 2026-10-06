function LoadingScreen({ message = "Preparing your portal..." }) {
    return (
        <div className="cuyotech-loading-screen" role="status" aria-live="polite">
            <div className="loading-brand-mark" aria-hidden="true">CT</div>
            <div className="loading-brand-copy">
                <strong>CuyoTech College of Science and Technology</strong>
                <span>Student Services Information System</span>
            </div>

            <div className="loading-progress" aria-hidden="true">
                <span />
                <span />
                <span />
            </div>

            <p>{message}</p>
        </div>
    );
}

export default LoadingScreen;
