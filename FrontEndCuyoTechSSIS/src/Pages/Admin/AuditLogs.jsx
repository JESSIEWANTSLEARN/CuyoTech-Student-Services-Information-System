import { useEffect, useMemo, useState } from "react";
import StaffPage from "../../Components/StaffPage.jsx";
import { apiRequest } from "../../services/api.js";

function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function loadLogs() {
            try {
                const data = await apiRequest("/admin/audit-logs");
                setLogs(data.logs);
            } catch (error) {
                setMessage(error.message);
            }
        }

        loadLogs();
    }, []);

    const filteredLogs = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return logs;
        }

        return logs.filter((log) => {
            const content = [
                log.action,
                log.actor?.email,
                log.target?.email,
                log.details,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return content.includes(keyword);
        });
    }, [logs, search]);

    return (
        <StaffPage
            role="admin"
            title="Audit logs"
            description="Review recent authentication and account-management activity."
        >
            {message && <p className="admin-message">{message}</p>}

            <div className="admin-card">
                <div className="admin-section-heading">
                    <div>
                        <p className="section-kicker">Account activity</p>
                        <h2>Recent events</h2>
                        <p>Use search when you need to locate a specific user or action.</p>
                    </div>
                </div>

                <div className="record-toolbar one-column">
                    <label className="search-control">
                        <span>Search audit logs</span>
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Email, action, or details"
                        />
                    </label>
                </div>

                <p className="results-count">{filteredLogs.length} event(s) shown</p>

                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Action</th>
                                <th>Actor</th>
                                <th>Target</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-cell">No matching activity.</td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td>{new Date(log.created_at).toLocaleString()}</td>
                                        <td><span className="activity-label">{log.action}</span></td>
                                        <td>{log.actor?.email || "System / guest"}</td>
                                        <td>{log.target?.email || "—"}</td>
                                        <td>{log.details || "—"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </StaffPage>
    );
}

export default AuditLogs;
