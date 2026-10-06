import StudentPage from "../../Components/Student/StudentPage.jsx";
import { ProfileSkeleton } from "../../Components/Skeleton.jsx";
import { useApiData } from "../../hooks/useApiData.js";

function StudentProfilePage() {
    const { data, loading, error } = useApiData("/student/profile", null);

    return (
        <StudentPage
            title="Profile"
            description="Your official student account and current enrollment information."
        >
            {loading && <ProfileSkeleton />}
            {error && <p className="workflow-message error">{error}</p>}

            {!loading && data?.student && (
                <section className="detail-card">
                    <div className="detail-grid">
                        <div><span>Student name</span><strong>{data.student.first_name} {data.student.last_name}</strong></div>
                        <div><span>Student number</span><strong>{data.student.student_number}</strong></div>
                        <div><span>Email</span><strong>{data.student.user?.email}</strong></div>
                        <div><span>Course</span><strong>{data.enrollment?.course?.name || "Not enrolled yet"}</strong></div>
                        <div><span>Year level</span><strong>{data.enrollment ? `Year ${data.enrollment.year_level}` : "—"}</strong></div>
                        <div><span>Academic term</span><strong>{data.enrollment ? `${data.enrollment.academic_year} · ${data.enrollment.semester}` : "—"}</strong></div>
                        <div><span>Department</span><strong>{data.enrollment?.course?.department?.name || "—"}</strong></div>
                        <div><span>Enrollment status</span><strong>{data.enrollment?.status || "—"}</strong></div>
                    </div>
                </section>
            )}
        </StudentPage>
    );
}

export default StudentProfilePage;
