import { getAuthUser } from "../services/auth.js";

const roles = {
    student: "Student",
    admin: "Admin",
    registrar: "Registrar",
    cashier: "Cashier",
    department: "Department",
};

function AccountBadge({ role, account }) {
    const currentUser = getAuthUser();
    const label = roles[role] ?? "Staff";

    return (
        <div className="account-badge" aria-label={`${label} account`}>
            <div className="account-avatar" aria-hidden="true">
                {label.charAt(0)}
            </div>
            <span>
                <strong>{account?.name || label}</strong>
                <small>{account?.number || currentUser?.email || "Account"}</small>
            </span>
        </div>
    );
}

export default AccountBadge;
