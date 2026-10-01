import StaffPage from "../../Components/StaffPage.jsx";
import ClearanceList from "../../Components/Department/ClearanceList.jsx";

function Clearance() {
    return (
        <StaffPage role="department" title="Clearance" description="Review department clearance requirements.">
            <ClearanceList />
        </StaffPage>
    );
}

export default Clearance;
