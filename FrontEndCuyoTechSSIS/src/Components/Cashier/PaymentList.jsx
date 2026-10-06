import { useMemo, useState } from "react";
import StatusBadge from "../StatusBadge.jsx";
import { useApiData } from "../../hooks/useApiData.js";
import { apiRequest } from "../../services/api.js";

function PaymentList() {
    const { data, loading, error, reload } = useApiData("/cashier/payments", { payments: [] });
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");

    const payments = useMemo(() => data?.payments || [], [data]);
    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return payments.filter((payment) => {
            const request = payment.document_request;
            const student = request.student;
            const value = `${student.student_number} ${student.first_name} ${student.last_name} ${request.document_type.code} ${payment.status} ${payment.reference_number || ""}`.toLowerCase();
            return !keyword || value.includes(keyword);
        });
    }, [payments, search]);

    async function verify(payment) {
        const reference = window.prompt("Payment reference number (leave blank to generate one):");

        if (reference === null) {
            return;
        }

        setMessage("");

        try {
            const response = await apiRequest(`/cashier/payments/${payment.id}/verify`, {
                method: "PUT",
                body: JSON.stringify({ reference_number: reference.trim() || null }),
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
                <div><h2>Payments</h2><p>Verify document-request payments. A receipt is created automatically.</p></div>
            </div>

            <div className="record-toolbar one-column">
                <label className="search-control">
                    <span>Search payments</span>
                    <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Student, document, reference, or status" />
                </label>
            </div>

            {message && <p className="workflow-message">{message}</p>}
            {loading && <p>Loading payments...</p>}
            {error && <p className="workflow-message error">{error}</p>}

            {!loading && !error && (
                <div className="table-scroll">
                    <table>
                        <thead><tr><th>Student</th><th>Document</th><th>Amount</th><th>Status</th><th>Reference</th><th>Action</th></tr></thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="6" className="empty-cell">No payment records.</td></tr>
                            ) : filtered.map((payment) => {
                                const request = payment.document_request;
                                const student = request.student;

                                return (
                                    <tr key={payment.id}>
                                        <td><strong>{student.last_name}, {student.first_name}</strong><small className="table-subtext">{student.student_number}</small></td>
                                        <td>{request.document_type.code}</td>
                                        <td>₱{Number(payment.amount).toFixed(2)}</td>
                                        <td><StatusBadge status={payment.status} /></td>
                                        <td>{payment.reference_number || "—"}</td>
                                        <td>{payment.status === "pending" ? <button className="table-action" onClick={() => verify(payment)}>Verify payment</button> : <span className="table-note">Verified</span>}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default PaymentList;
