import { useMemo, useState } from "react";
import { useApiData } from "../../hooks/useApiData.js";

function ReceiptList() {
    const { data, loading, error } = useApiData("/cashier/receipts", { receipts: [] });
    const [search, setSearch] = useState("");
    const receipts = data?.receipts || [];

    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return receipts.filter((receipt) => {
            const request = receipt.payment.document_request;
            const student = request.student;
            const value = `${receipt.receipt_number} ${student.student_number} ${student.first_name} ${student.last_name} ${request.document_type.code}`.toLowerCase();
            return !keyword || value.includes(keyword);
        });
    }, [receipts, search]);

    return (
        <section className="record-panel">
            <div className="record-panel-heading">
                <div><h2>Receipts</h2><p>Receipts issued from verified document-request payments.</p></div>
            </div>

            <div className="record-toolbar one-column">
                <label className="search-control">
                    <span>Search receipts</span>
                    <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Receipt, student, or document" />
                </label>
            </div>

            {loading && <p>Loading receipts...</p>}
            {error && <p className="workflow-message error">{error}</p>}

            {!loading && !error && (
                <div className="table-scroll">
                    <table>
                        <thead><tr><th>Receipt</th><th>Student</th><th>Document</th><th>Amount</th><th>Issued</th></tr></thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="5" className="empty-cell">No receipts issued yet.</td></tr>
                            ) : filtered.map((receipt) => {
                                const request = receipt.payment.document_request;
                                const student = request.student;

                                return (
                                    <tr key={receipt.id}>
                                        <td><strong>{receipt.receipt_number}</strong></td>
                                        <td>{student.last_name}, {student.first_name}<small className="table-subtext">{student.student_number}</small></td>
                                        <td>{request.document_type.code}</td>
                                        <td>₱{Number(receipt.payment.amount).toFixed(2)}</td>
                                        <td>{new Date(receipt.issued_at).toLocaleString()}</td>
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

export default ReceiptList;
