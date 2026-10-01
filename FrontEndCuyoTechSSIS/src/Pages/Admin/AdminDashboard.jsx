import ModuleDashboard from "../../Components/ModuleDashboard.jsx";

function AdminDashboard() {
    return (
        <ModuleDashboard
            role="admin"
            title="Admin Dashboard"
            description="Manage system access and university staff accounts."
            areas={[
                { title: "User accounts", path: "/admin/users", description: "Account records and assigned roles will appear after the Admin API is connected." },
            ]}
        />
    );
}

export default AdminDashboard;
