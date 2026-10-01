import StudentPage from "../../Components/Student/StudentPage.jsx";
import StudentSubjects from "../../Components/Student/StudentSubjects.jsx";

function StudentSubjectsPage() {
    return (
        <StudentPage title="Subjects" description="View your enrolled subjects when Registrar records are connected.">
            <div className="dashboard-grid">
                <StudentSubjects />
            </div>
        </StudentPage>
    );
}

export default StudentSubjectsPage;
