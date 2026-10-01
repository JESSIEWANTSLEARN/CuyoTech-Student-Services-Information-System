import ModuleDashboard from "../../Components/ModuleDashboard.jsx";

function RegistrarDashboard() {
    return (
        <ModuleDashboard
            title="Registrar Dashboard"
            description="Review enrollment and academic records."
            areas={[
                { title: "Enrollment", description: "Enrollment records will appear after the Registrar API is connected." },
                { title: "Grades", description: "Grade encoding and release will be available after integration." },
                { title: "Document requests", description: "Requests requiring Registrar processing will appear here." },
            ]}
        />
    );
}

export default RegistrarDashboard;
