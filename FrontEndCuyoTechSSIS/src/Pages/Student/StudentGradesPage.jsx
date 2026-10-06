import StudentPage from "../../Components/Student/StudentPage.jsx";
import { TableSkeleton } from "../../Components/Skeleton.jsx";
import { useApiData } from "../../hooks/useApiData.js";

function StudentGradesPage() {
    const { data, loading, error } = useApiData("/student/grades", null);
    const grades = data?.grades || [];

    return (
        <StudentPage
            title="Grades"
            description="Only grades released by the Registrar are shown here."
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
                            <h2>Released grades</h2>
                            <p>{data?.enrollment ? `${data.enrollment.academic_year} · ${data.enrollment.semester}` : "No active enrollment."}</p>
                        </div>
                        <span className="record-count">{grades.length} released</span>
                    </div>

                    <div className="table-scroll">
                        <table>
                            <thead><tr><th>Code</th><th>Subject</th><th>Units</th><th>Grade</th></tr></thead>
                            <tbody>
                                {grades.length === 0 ? (
                                    <tr><td colSpan="4" className="empty-cell">No released grades.</td></tr>
                                ) : grades.map((record) => (
                                    <tr key={record.id}>
                                        <td><strong>{record.subject.code}</strong></td>
                                        <td>{record.subject.name}</td>
                                        <td>{record.subject.units}</td>
                                        <td><strong className="grade-value">{record.grade}</strong></td>
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

export default StudentGradesPage;
