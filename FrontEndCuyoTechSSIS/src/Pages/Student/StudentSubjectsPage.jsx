import StudentPage from "../../Components/Student/StudentPage.jsx";
import { TableSkeleton } from "../../Components/Skeleton.jsx";
import { useApiData } from "../../hooks/useApiData.js";

function StudentSubjectsPage() {
    const { data, loading, error } = useApiData("/student/subjects", null);
    const subjects = data?.subjects || [];

    return (
        <StudentPage
            title="Subjects"
            description="Review the subjects included in your current enrollment."
        >
            {loading && (
                <section className="record-panel">
                    <TableSkeleton rows={5} columns={4} />
                </section>
            )}
            {error && <p className="workflow-message error">{error}</p>}

            {!loading && !error && (
                <section className="record-panel">
                    <div className="record-panel-heading">
                        <div>
                            <h2>{data?.enrollment ? `${data.enrollment.academic_year} · ${data.enrollment.semester}` : "Current subjects"}</h2>
                            <p>{data?.enrollment?.course?.name || "No active enrollment record."}</p>
                        </div>
                        <span className="record-count">{subjects.length} subject(s)</span>
                    </div>

                    <div className="table-scroll">
                        <table>
                            <thead><tr><th>Code</th><th>Subject</th><th>Units</th><th>Status</th></tr></thead>
                            <tbody>
                                {subjects.length === 0 ? (
                                    <tr><td colSpan="4" className="empty-cell">No enrolled subjects.</td></tr>
                                ) : subjects.map((record) => (
                                    <tr key={record.id}>
                                        <td><strong>{record.subject.code}</strong></td>
                                        <td>{record.subject.name}</td>
                                        <td>{record.subject.units}</td>
                                        <td>{record.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </StudentPage>
    );
}

export default StudentSubjectsPage;
