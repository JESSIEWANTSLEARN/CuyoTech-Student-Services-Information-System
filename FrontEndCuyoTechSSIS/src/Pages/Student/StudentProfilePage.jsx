import StudentPage from "../../Components/Student/StudentPage.jsx";
import StudentProfile from "../../Components/Student/StudentProfile.jsx";

function StudentProfilePage() {
    return (
        <StudentPage title="Profile" description="Your student profile will be shown after your account is linked to enrollment records.">
            <div className="dashboard-grid">
                <StudentProfile />
            </div>
        </StudentPage>
    );
}

export default StudentProfilePage;
