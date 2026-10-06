import { useApiData } from "../../hooks/useApiData.js";
import { SkeletonCard } from "../Skeleton.jsx";

function StudentProfile() {
    const { data, loading, error } = useApiData("/student/profile", null);

    if (loading) {
        return <SkeletonCard />;
    }

    if (error || !data?.student) {
        return <section className="dashboard-card"><h2>Profile</h2><p>{error || "Profile unavailable."}</p></section>;
    }

    const student = data.student;
    const enrollment = data.enrollment;

    return (
        <section className="dashboard-card" aria-labelledby="profile-title">
            <h2 id="profile-title">Profile</h2>
            <p className="card-primary">{student.first_name} {student.last_name}</p>
            <p>{student.student_number}</p>
            <p>{enrollment?.course?.code || "No current enrollment"} · {enrollment ? `Year ${enrollment.year_level}` : "—"}</p>
        </section>
    );
}

export default StudentProfile;
