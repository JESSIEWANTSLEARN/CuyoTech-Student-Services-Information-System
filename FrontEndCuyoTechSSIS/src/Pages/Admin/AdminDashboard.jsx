import ModuleDashboard from "../../Components/ModuleDashboard.jsx";

function AdminDashboard() {
    return (
        <ModuleDashboard
            role="admin"
            title="Admin Dashboard"
            description="Manage accounts, publish university service information, and inspect each role-based portal."
            areas={[
                {
                    title: "User accounts",
                    path: "/admin/users",
                    description: "Create accounts, manage roles and status, reset passwords, and revoke active sessions.",
                },
                {
                    title: "Notices & dates",
                    path: "/admin/content",
                    description: "Publish university service announcements and important dates by audience.",
                },
                {
                    title: "System portals",
                    path: "/admin/system-portals",
                    description: "Preview Student, Registrar, Cashier, and Department portal structure without changing your Admin role.",
                },
                {
                    title: "Audit logs",
                    path: "/admin/audit-logs",
                    description: "Review login and account-management activity in one searchable list.",
                },
            ]}
        />
    );
}

export default AdminDashboard;
