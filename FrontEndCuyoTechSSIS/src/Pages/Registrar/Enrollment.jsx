import EnrollmentList from "../../Components/Registrar/EnrollmentList.jsx";
import StaffPage from "../../Components/StaffPage.jsx";

function Enrollment() {
    return (
        <StaffPage role="registrar" title="Enrollment" description="Record each student's approved course, term, year level, and subjects.">
            <EnrollmentList />
        </StaffPage>
    );
}

export default Enrollment;
