import ModuleDashboard from "../../Components/ModuleDashboard.jsx";

function RegistrarDashboard() {
    return (
        <ModuleDashboard
            role="registrar"
            title="Registrar Dashboard"
            description="Review enrollment and academic records."
            areas={[
                { title: "Enrollment", path: "/registrar/enrollment", description: "Enrollment records will appear after the Registrar API is connected." },
                { title: "Grades", path: "/registrar/grades", description: "Grade encoding and release will be available after integration." },
                { title: "Document requests", path: "/registrar/document-requests", description: "Requests requiring Registrar processing will appear here." },
            ]}
        />
    );
}

export default RegistrarDashboard;
