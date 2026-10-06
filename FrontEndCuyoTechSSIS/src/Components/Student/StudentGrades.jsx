import { useApiData } from "../../hooks/useApiData.js";
import { SkeletonCard } from "../Skeleton.jsx";

function StudentGrades() {
    const { data, loading, error } = useApiData("/student/grades", null);

    if (loading) {
        return <SkeletonCard />;
    }

    if (error) {
        return <section className="dashboard-card"><h2>Grades</h2><p>{error}</p></section>;
    }

    const grades = data?.grades || [];

    return (
        <section className="dashboard-card" aria-labelledby="grades-title">
            <h2 id="grades-title">Released grades</h2>
            {grades.length === 0 ? (
                <p>No released grades yet.</p>
            ) : (
                <div className="mini-list">
                    {grades.slice(0, 3).map((record) => (
                        <div key={record.id}>
                            <strong>{record.subject.code}</strong>
                            <span className="grade-value">{record.grade}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default StudentGrades;
