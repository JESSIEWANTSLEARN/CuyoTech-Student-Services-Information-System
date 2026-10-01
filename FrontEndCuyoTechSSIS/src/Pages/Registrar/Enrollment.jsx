import StaffPage from "../../Components/StaffPage.jsx";
import EnrollmentList from "../../Components/Registrar/EnrollmentList.jsx";

function Enrollment() {
    return (
        <StaffPage role="registrar" title="Enrollment" description="Review enrollment records managed by the Registrar.">
            <EnrollmentList />
        </StaffPage>
    );
}

export default Enrollment;
