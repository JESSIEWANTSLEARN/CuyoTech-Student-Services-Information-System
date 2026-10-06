import { useApiData } from "../../hooks/useApiData.js";
import { SkeletonCard } from "../Skeleton.jsx";

function StudentSubjects() {
    const { data, loading, error } = useApiData("/student/subjects", null);

    if (loading) {
        return <SkeletonCard />;
    }

    if (error) {
        return <section className="dashboard-card"><h2>Subjects</h2><p>{error}</p></section>;
    }

    const subjects = data?.subjects || [];

    return (
        <section className="dashboard-card" aria-labelledby="subjects-title">
            <h2 id="subjects-title">Subjects</h2>
            {subjects.length === 0 ? (
                <p>No enrolled subjects yet.</p>
            ) : (
                <div className="mini-list">
                    {subjects.slice(0, 3).map((record) => (
                        <div key={record.id}>
                            <strong>{record.subject.code}</strong>
                            <span>{record.subject.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default StudentSubjects;
