import { useMemo, useState } from "react";
import { useApiData } from "../../hooks/useApiData.js";
import { apiRequest } from "../../services/api.js";

function GradeEncodingList() {
    const { data, loading, error, reload } = useApiData("/registrar/grades", { grade_records: [] });
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");

    const records = useMemo(() => data?.grade_records || [], [data]);
    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return records.filter((record) => {
            const student = record.enrollment.student;
            const value = `${student.student_number} ${student.first_name} ${student.last_name} ${record.subject.code} ${record.subject.name}`.toLowerCase();
            return !keyword || value.includes(keyword);
        });
    }, [records, search]);

    return (
        <section className="record-panel">
            <div className="record-panel-heading">
                <div><h2>Grade encoding</h2><p>Enter grades and choose when they become visible to students.</p></div>
            </div>

            <div className="record-toolbar one-column">
                <label className="search-control">
                    <span>Search grade records</span>
                    <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Student or subject" />
                </label>
            </div>

            {message && <p className="workflow-message">{message}</p>}
            {loading && <p>Loading grade records...</p>}
            {error && <p className="workflow-message error">{error}</p>}

            {!loading && !error && (
                <div className="table-scroll">
                    <table>
                        <thead><tr><th>Student</th><th>Subject</th><th>Grade</th><th>Student can view</th><th>Action</th></tr></thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan="5" className="empty-cell">No grade records.</td></tr>
                            ) : filtered.map((record) => (
                                <GradeRow key={record.id} record={record} reload={reload} setMessage={setMessage} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

function GradeRow({ record, reload, setMessage }) {
    const [grade, setGrade] = useState(record.grade ?? "");
    const [released, setReleased] = useState(Boolean(record.is_released));
    const student = record.enrollment.student;

    async function save() {
        setMessage("");

        try {
            const response = await apiRequest(`/registrar/grades/${record.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    grade: grade === "" ? null : Number(grade),
                    is_released: released,
                }),
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
            <td><strong>{record.subject.code}</strong><small className="table-subtext">{record.subject.name}</small></td>
            <td><input className="table-input short" type="number" min="1" max="5" step="0.01" value={grade} onChange={(event) => setGrade(event.target.value)} /></td>
            <td><label className="inline-check"><input type="checkbox" checked={released} onChange={(event) => setReleased(event.target.checked)} /> Released</label></td>
            <td><button type="button" className="table-action" onClick={save}>Save</button></td>
        </tr>
    );
}

export default GradeEncodingList;
