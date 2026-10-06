import { useEffect, useState } from "react";
import StudentPage from "../../Components/Student/StudentPage.jsx";
import { apiRequest } from "../../services/api.js";

function DocumentRequest() {
    const [types, setTypes] = useState([]);
    const [documentTypeId, setDocumentTypeId] = useState("");
    const [purpose, setPurpose] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        apiRequest("/student/document-types")
            .then((data) => setTypes(data.document_types))
            .catch((error) => setMessage(error.message));
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const data = await apiRequest("/student/document-requests", {
                method: "POST",
                body: JSON.stringify({
                    document_type_id: Number(documentTypeId),
                    purpose,
                }),
            });

            setMessage(data.message);
            setDocumentTypeId("");
            setPurpose("");
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    const selectedType = types.find((type) => String(type.id) === String(documentTypeId));

    return (
        <StudentPage
            title="Request a school document"
            description="Choose the document you need and tell the Registrar its purpose."
        >
            <form className="request-form" onSubmit={handleSubmit}>
                <label htmlFor="document-type">Document type</label>
                <select
                    id="document-type"
                    value={documentTypeId}
                    onChange={(event) => setDocumentTypeId(event.target.value)}
                    required
                >
                    <option value="">Select a document</option>
                    {types.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name} ({type.code}) — ₱{Number(type.fee_amount).toFixed(2)}
                        </option>
                    ))}
                </select>

                {selectedType && (
                    <div className="request-fee-note">
                        <span>Processing fee</span>
                        <strong>₱{Number(selectedType.fee_amount).toFixed(2)}</strong>
                    </div>
                )}

                <label htmlFor="request-purpose">Purpose of request</label>
                <textarea
                    id="request-purpose"
                    value={purpose}
                    onChange={(event) => setPurpose(event.target.value)}
                    rows="5"
                    placeholder="Example: Scholarship application"
                    required
                />

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Submitting..." : "Submit request"}
                </button>

                {message && <p className="workflow-message">{message}</p>}
            </form>
        </StudentPage>
    );
}

export default DocumentRequest;
