import StaffPage from "../../Components/StaffPage.jsx";
import GradeEncodingList from "../../Components/Registrar/GradeEncodingList.jsx";

function GradeEncoding() {
    return (
        <StaffPage role="registrar" title="Grade encoding" description="Review the grade encoding workflow.">
            <GradeEncodingList />
        </StaffPage>
    );
}

export default GradeEncoding;
