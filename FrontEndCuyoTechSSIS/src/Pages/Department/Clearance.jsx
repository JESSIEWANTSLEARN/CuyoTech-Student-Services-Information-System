import ClearanceList from "../../Components/Department/ClearanceList.jsx";
import StaffPage from "../../Components/StaffPage.jsx";

function Clearance() {
    return (
        <StaffPage role="department" title="Clearance" description="Review and update department clearance records for enrolled students.">
            <ClearanceList />
        </StaffPage>
    );
}

export default Clearance;
