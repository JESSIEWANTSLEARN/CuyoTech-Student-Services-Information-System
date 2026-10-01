import StudentPage from "../../Components/Student/StudentPage.jsx";
import StudentRequestList from "../../Components/Student/StudentRequestList.jsx";

function StudentRequests() {
    return (
        <StudentPage title="Document request status" description="Track the requests you submit for school documents.">
            <div className="dashboard-grid">
                <StudentRequestList />
            </div>
        </StudentPage>
    );
}

export default StudentRequests;
