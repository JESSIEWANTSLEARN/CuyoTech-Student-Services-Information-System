import ModuleDashboard from "../../Components/ModuleDashboard.jsx";

function DepartmentDashboard() {
    return (
        <ModuleDashboard
            title="Department Dashboard"
            description="Review student clearance requests."
            areas={[
                { title: "Clearance queue", description: "Clearance records will appear after the Department API is connected." },
                { title: "Decisions", description: "Clearance decisions and status updates will be available after integration." },
            ]}
        />
    );
}

export default DepartmentDashboard;
