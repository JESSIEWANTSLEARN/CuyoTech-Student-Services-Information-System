import ModuleDashboard from "../../Components/ModuleDashboard.jsx";

function DepartmentDashboard() {
    return (
        <ModuleDashboard
            role="department"
            title="Department Dashboard"
            description="Review student clearance requests."
            areas={[
                { title: "Clearance", path: "/department/clearance", description: "Clearance records and decisions will appear after the Department API is connected." },
            ]}
        />
    );
}

export default DepartmentDashboard;
