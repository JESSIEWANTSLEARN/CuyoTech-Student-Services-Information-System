import { useMemo, useState } from "react";
import StatusBadge from "../StatusBadge.jsx";
import { useApiData } from "../../hooks/useApiData.js";
import { apiRequest } from "../../services/api.js";

function DocumentRequestList() {
    const { data, loading, error, reload } = useApiData("/registrar/document-requests", { requests: [] });
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");

    const requests = useMemo(() => data?.requests || [], [data]);
    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return requests.filter((request) => {
            const student = request.student;
            const value = `${student.student_number} ${student.first_name} ${student.last_name} ${request.document_type.code} ${request.status}`.toLowerCase();
            return !keyword || value.includes(keyword);
        });
    }, [requests, search]);

    async function act(request, action) {
        let remarks = null;

        if (action === "reject") {
            remarks = window.prompt("Reason for rejection (optional):") ?? "";
        }

        setMessage("");

        try {
            const response = await apiRequest(`/registrar/document-requests/${request.id}`, {
                method: "PUT",
                body: JSON.stringify({ action, remarks }),
            });

            setMessage(response.message);
            reload();
        } catch (requestError) {
            setMessage(requestError.message);
        }
    }

    return (
        <section className="record-panel">
            <div className="record-panel-heading">
                <div><h2>Document requests</h2><p>Review each request and move it through the correct workflow.</p></div>
            </div>

            <div className="record-toolbar one-column">
                <label className="search-control">
                    <span>Search requests</span>
                    <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Student, document, or status" />
                </label>
            </div>

            {message && <p className="workflow-message">{message}</p>}
            {loading && <p>Loading requests...</p>}
            {error && <p className="workflow-message error">{error}</p>}

            {!loading && !error && (
                <div className="table-scroll">
                    <table>
                        <thead><tr><th>Request</th><th>Student</th><th>Fee</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="5" className="empty-cell">No document requests.</td></tr>
                            ) : filtered.map((request) => (
                                <tr key={request.id}>
                                    <td><strong>{request.document_type.code}</strong><small className="table-subtext">#{request.id} · {request.purpose}</small></td>
                                    <td><strong>{request.student.last_name}, {request.student.first_name}</strong><small className="table-subtext">{request.student.student_number}</small></td>
                                    <td>₱{Number(request.fee_amount_snapshot).toFixed(2)}</td>
                                    <td><StatusBadge status={request.status} /></td>
                                    <td><RequestActions request={request} act={act} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

function RequestActions({ request, act }) {
    if (request.status === "pending") {
        return <div className="row-actions"><button onClick={() => act(request, "approve")}>Approve</button><button onClick={() => act(request, "reject")}>Reject</button></div>;
    }

    if (request.status === "payment_pending") {
        return <span className="table-note">Waiting for Cashier</span>;
    }

    if (request.status === "processing") {
        return <button className="table-action" onClick={() => act(request, "mark_ready")}>Mark ready</button>;
    }

    if (request.status === "ready") {
        return <button className="table-action" onClick={() => act(request, "release")}>Release</button>;
    }

    return <span className="table-note">No action needed</span>;
}

export default DocumentRequestList;
