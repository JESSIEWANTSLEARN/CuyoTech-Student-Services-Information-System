import StaffPage from "../../Components/StaffPage.jsx";
import DocumentRequestList from "../../Components/Registrar/DocumentRequestList.jsx";

function DocumentRequests() {
    return (
        <StaffPage role="registrar" title="Document requests" description="Review school document requests awaiting Registrar processing.">
            <DocumentRequestList />
        </StaffPage>
    );
}

export default DocumentRequests;
