import StaffPage from "../../Components/StaffPage.jsx";
import UserAccountList from "../../Components/Admin/UserAccountList.jsx";

function UserAccounts() {
    return (
        <StaffPage role="admin" title="User accounts" description="Review accounts and their assigned roles.">
            <UserAccountList />
        </StaffPage>
    );
}

export default UserAccounts;
