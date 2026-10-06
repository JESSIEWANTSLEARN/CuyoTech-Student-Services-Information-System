import DocumentRequestList from "../../Components/Registrar/DocumentRequestList.jsx";
import StaffPage from "../../Components/StaffPage.jsx";

function DocumentRequests() {
    return (
        <StaffPage role="registrar" title="Document requests" description="Review, approve, process, and release student document requests.">
            <DocumentRequestList />
        </StaffPage>
    );
}

export default DocumentRequests;
