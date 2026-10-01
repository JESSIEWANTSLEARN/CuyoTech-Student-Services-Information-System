import ModuleDashboard from "../../Components/ModuleDashboard.jsx";

function AdminDashboard() {
    return (
        <ModuleDashboard
            title="Admin Dashboard"
            description="Manage system access and university staff accounts."
            areas={[
                { title: "User accounts", description: "Account records will appear after the Admin API is connected." },
                { title: "Roles and access", description: "Role assignments and access controls will be managed here." },
            ]}
        />
    );
}

export default AdminDashboard;
