import StudentPage from "../../Components/Student/StudentPage.jsx";
import StudentGrades from "../../Components/Student/StudentGrades.jsx";

function StudentGradesPage() {
    return (
        <StudentPage title="Grades" description="View released grades when Registrar records are connected.">
            <div className="dashboard-grid">
                <StudentGrades />
            </div>
        </StudentPage>
    );
}

export default StudentGradesPage;
