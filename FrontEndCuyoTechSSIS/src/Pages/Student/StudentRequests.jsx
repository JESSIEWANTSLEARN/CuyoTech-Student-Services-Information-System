import StudentPage from "../../Components/Student/StudentPage.jsx";
import StatusBadge from "../../Components/StatusBadge.jsx";
import { useApiData } from "../../hooks/useApiData.js";

function StudentRequests() {
    const { data, loading, error, reload } = useApiData("/student/document-requests", null);
    const requests = data?.requests || [];

    return (
        <StudentPage
            title="Request status"
            description="Track document review, payment, processing, and release in one place."
        >
            <div className="page-action-row">
                <span>{requests.length} request(s)</span>
                <button type="button" onClick={reload}>Refresh</button>
            </div>

            {loading && <p>Loading requests...</p>}
            {error && <p className="workflow-message error">{error}</p>}

            {!loading && !error && (
                <div className="request-list">
                    {requests.length === 0 ? (
                        <section className="detail-card"><p>No document requests yet.</p></section>
                    ) : requests.map((request) => (
                        <section className="request-status-card" key={request.id}>
                            <div className="request-status-header">
                                <div>
                                    <span className="request-id">Request #{request.id}</span>
                                    <h2>{request.document_type.name}</h2>
                                </div>
                                <StatusBadge status={request.status} />
                            </div>

                            <div className="request-details-grid">
                                <div><span>Purpose</span><strong>{request.purpose}</strong></div>
                                <div><span>Fee</span><strong>₱{Number(request.fee_amount_snapshot).toFixed(2)}</strong></div>
                                <div><span>Submitted</span><strong>{new Date(request.submitted_at).toLocaleString()}</strong></div>
                                <div><span>Payment</span><strong>{request.payment?.status || "Not created yet"}</strong></div>
                                <div><span>Reference</span><strong>{request.payment?.reference_number || "—"}</strong></div>
                                <div><span>Receipt</span><strong>{request.payment?.receipt?.receipt_number || "—"}</strong></div>
                            </div>

                            {request.registrar_notes && (
                                <p className="request-note"><strong>Registrar note:</strong> {request.registrar_notes}</p>
                            )}
                        </section>
                    ))}
                </div>
            )}
        </StudentPage>
    );
}

export default StudentRequests;
