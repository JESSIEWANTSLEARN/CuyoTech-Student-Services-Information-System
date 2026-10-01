import RecordList from "../RecordList.jsx";

function UserAccountList() {
    return <RecordList
        title="User accounts"
        description="Review the accounts created for enrolled students and authorized staff."
        columns={["Account", "Role", "Status"]}
        emptyMessage="No account records are connected yet."
    />;
}

export default UserAccountList;
