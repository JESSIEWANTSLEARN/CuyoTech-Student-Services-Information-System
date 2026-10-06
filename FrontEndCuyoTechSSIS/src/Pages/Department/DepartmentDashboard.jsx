import ModuleDashboard from "../../Components/ModuleDashboard.jsx";

function DepartmentDashboard() {
    return (
        <ModuleDashboard
            role="department"
            title="Department Dashboard"
            description="Process student department clearance records."
            areas={[
                { title: "Clearance", path: "/department/clearance", description: "Mark enrolled students as pending, cleared, or on hold." },
            ]}
        />
    );
}

export default DepartmentDashboard;
