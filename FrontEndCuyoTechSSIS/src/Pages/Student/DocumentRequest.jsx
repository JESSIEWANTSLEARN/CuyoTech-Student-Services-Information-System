import { Link } from "react-router-dom";
import Header from "../../Components/Header.jsx";
import SideBar from "../../Components/SideBar.jsx";
import Footer from "../../Components/Footer.jsx";

function DocumentRequest() {
    return (
        <>
            <Header />
            <div className="dashboard-layout">
                <SideBar />
                <main className="dashboard-content">
                    <p className="eyebrow">Student services</p>
                    <h1>Request a school document</h1>
                    <p>
                        Choose a document and provide its purpose. Submission
                        will be available after this page is connected to the backend.
                    </p>

                    <form className="request-form">
                        <label htmlFor="document-type">Document type</label>
                        <select id="document-type" name="documentType" required defaultValue="">
                            <option value="" disabled>Select a document</option>
                            <option value="TOR">Transcript of Records (TOR)</option>
                            <option value="COR">Certificate of Registration (COR)</option>
                            <option value="Certification">Certification</option>
                        </select>

                        <label htmlFor="request-purpose">Purpose of request</label>
                        <textarea
                            id="request-purpose"
                            name="purpose"
                            rows="4"
                            placeholder="Briefly explain why you need this document"
                            required
                        />

                        <button type="submit" className="submit-button" disabled>
                            Submit request (coming soon)
                        </button>
                        <p className="form-note">
                            Request status and payment details will be shown
                            after integration.
                        </p>
                    </form>

                    <Link to="/student/dashboard" className="back-link">
                        Back to dashboard
                    </Link>
                    {" · "}
                    <Link to="/student/requests" className="back-link">
                        View request status
                    </Link>
                </main>
            </div>
            <Footer />
        </>
    );
}

export default DocumentRequest;
