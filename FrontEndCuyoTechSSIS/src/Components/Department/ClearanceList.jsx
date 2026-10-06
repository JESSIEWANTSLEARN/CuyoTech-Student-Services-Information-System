import { useMemo, useState } from "react";
import StatusBadge from "../StatusBadge.jsx";
import { useApiData } from "../../hooks/useApiData.js";
import { apiRequest } from "../../services/api.js";

function ClearanceList() {
    const { data, loading, error, reload } = useApiData("/department/clearances", { clearances: [] });
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");

    const clearances = data?.clearances || [];
    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return clearances.filter((clearance) => {
            const student = clearance.student;
            const value = `${student.student_number} ${student.first_name} ${student.last_name} ${clearance.department.code} ${clearance.status}`.toLowerCase();
            return !keyword || value.includes(keyword);
        });
    }, [clearances, search]);

    return (
        <section className="record-panel">
            <div className="record-panel-heading">
                <div><h2>Clearance records</h2><p>Update each enrolled student's department clearance status.</p></div>
            </div>

            <div className="record-toolbar one-column">
                <label className="search-control">
                    <span>Search clearance records</span>
                    <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Student, department, or status" />
                </label>
            </div>

            {message && <p className="workflow-message">{message}</p>}
            {loading && <p>Loading clearances...</p>}
            {error && <p className="workflow-message error">{error}</p>}

            {!loading && !error && (
                <div className="table-scroll">
                    <table>
                        <thead><tr><th>Student</th><th>Term</th><th>Department</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="5" className="empty-cell">No clearance records.</td></tr>
                            ) : filtered.map((clearance) => (
                                <ClearanceRow key={clearance.id} clearance={clearance} reload={reload} setMessage={setMessage} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

function ClearanceRow({ clearance, reload, setMessage }) {
    const [status, setStatus] = useState(clearance.status);
    const [remarks, setRemarks] = useState(clearance.remarks || "");
    const student = clearance.student;

    async function save() {
        setMessage("");

        try {
            const response = await apiRequest(`/department/clearances/${clearance.id}`, {
                method: "PUT",
                body: JSON.stringify({ status, remarks }),
            });

            setMessage(response.message);
            reload();
        } catch (error) {
            setMessage(error.message);
        }
    }

    return (
        <tr>
            <td><strong>{student.last_name}, {student.first_name}</strong><small className="table-subtext">{student.student_number}</small></td>
            <td>{clearance.academic_year}<small className="table-subtext">{clearance.semester}</small></td>
            <td>{clearance.department.code}</td>
            <td>
                <select className="table-input" value={status} onChange={(event) => setStatus(event.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="cleared">Cleared</option>
                    <option value="hold">Hold</option>
                </select>
                <StatusBadge status={clearance.status} />
            </td>
            <td>
                <div className="row-actions stacked">
                    <input className="table-input" value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Remarks" />
                    <button className="table-action" type="button" onClick={save}>Save</button>
                </div>
            </td>
        </tr>
    );
}

export default ClearanceList;
