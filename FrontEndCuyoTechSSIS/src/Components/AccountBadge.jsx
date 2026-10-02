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
        <div className="flex min-w-0 items-center gap-3" aria-label={`${label} account`}>
            <img
                className="size-12 shrink-0 rounded-full border-2 border-line bg-panel object-cover"
                src={account?.photoUrl || "/PlaceHolderLogo.png"}
                alt=""
            />
            <span className="flex max-w-40 flex-col leading-tight">
                <strong className="truncate text-sm text-ink">{account?.name || `${label} account pending`}</strong>
                <small className="truncate text-xs text-muted">{account?.number || "ID pending"}</small>
            </span>
        </div>
    );
}

export default AccountBadge;
