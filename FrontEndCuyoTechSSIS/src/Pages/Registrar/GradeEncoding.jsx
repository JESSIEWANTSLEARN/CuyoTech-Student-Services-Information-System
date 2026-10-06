import GradeEncodingList from "../../Components/Registrar/GradeEncodingList.jsx";
import StaffPage from "../../Components/StaffPage.jsx";

function GradeEncoding() {
    return (
        <StaffPage role="registrar" title="Grade encoding" description="Encode grades and control when they are released to students.">
            <GradeEncodingList />
        </StaffPage>
    );
}

export default GradeEncoding;
