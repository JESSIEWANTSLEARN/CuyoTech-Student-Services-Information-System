import ModuleDashboard from "../../Components/ModuleDashboard.jsx";

function RegistrarDashboard() {
    return (
        <ModuleDashboard
            role="registrar"
            title="Registrar Dashboard"
            description="Manage enrollment, grades, and document-request processing."
            areas={[
                { title: "Enrollment", path: "/registrar/enrollment", description: "Assign course, term, year level, and subjects to student accounts." },
                { title: "Grade encoding", path: "/registrar/grades", description: "Encode grades and choose when students can view them." },
                { title: "Document requests", path: "/registrar/document-requests", description: "Approve requests, monitor payment, and mark documents ready for release." },
            ]}
        />
    );
}

export default RegistrarDashboard;
