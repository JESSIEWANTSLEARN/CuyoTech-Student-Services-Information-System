import UserAccountList from "../../Components/Admin/UserAccountList.jsx";
import StaffPage from "../../Components/StaffPage.jsx";

function UserAccounts() {
    return (
        <StaffPage
            role="admin"
            title="User accounts"
            description="Create and manage student and authorized staff accounts."
        >
            <UserAccountList />
        </StaffPage>
    );
}

export default UserAccounts;
