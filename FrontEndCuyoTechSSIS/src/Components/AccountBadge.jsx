const roles = {
    student: "Student",
    admin: "Admin",
    registrar: "Registrar",
    cashier: "Cashier",
    department: "Department",
};

function AccountBadge({ role, account }) {
    const label = roles[role] ?? "Staff";
    return (
        <div className="account-badge" aria-label={`${label} account`}>
            <img
                src={account?.photoUrl || "/PlaceHolderLogo.png"}
                alt=""
            />
            <span>
                <strong>{account?.name || `${label} account`}</strong>
                <small>{account?.number || "ID unavailable"}</small>
            </span>
        </div>
    );
}

export default AccountBadge;
