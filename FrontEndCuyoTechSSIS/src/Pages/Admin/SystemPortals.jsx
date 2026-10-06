import { Link, useParams } from "react-router-dom";
import StaffPage from "../../Components/StaffPage.jsx";

const portals = {
    student: {
        title: "Student Portal",
        description: "Academic records and student-service workflow.",
        menu: ["Dashboard", "Profile", "Subjects", "Grades", "Request a document", "Request status"],
        cards: ["View grades", "View subjects", "Request a document", "Track requests"],
    },
    registrar: {
        title: "Registrar Portal",
        description: "Enrollment, grade encoding, and document processing.",
        menu: ["Dashboard", "Enrollment", "Grade encoding", "Document requests"],
        cards: ["Enrollment", "Grade encoding", "Document requests"],
    },
    cashier: {
        title: "Cashier Portal",
        description: "Payment verification and receipt records.",
        menu: ["Dashboard", "Payments", "Receipts"],
        cards: ["Pending payments", "Receipts"],
    },
    department: {
        title: "Department Portal",
        description: "Department clearance processing.",
        menu: ["Dashboard", "Clearance"],
        cards: ["Pending clearance", "Cleared records", "On hold"],
    },
};

function SystemPortals() {
    const { role } = useParams();
    const selected = role && portals[role] ? portals[role] : null;

    return (
        <StaffPage
            role="admin"
            title="System portals"
            description="Inspect each role-based workspace in read-only Admin Preview mode."
        >
            <div className="portal-preview-selector">
                {Object.entries(portals).map(([key, portal]) => (
                    <Link
                        key={key}
                        className={selected && key === role ? "portal-selector active" : "portal-selector"}
                        to={`/admin/system-portals/${key}`}
                    >
                        <strong>{portal.title}</strong>
                        <span>{portal.description}</span>
                    </Link>
                ))}
            </div>

            {selected ? (
                <section className="portal-preview-shell">
                    <div className="preview-banner">
                        <strong>ADMIN PREVIEW</strong>
                        <span>Viewing {selected.title}. Transactions are disabled in preview mode.</span>
                    </div>

                    <div className="preview-layout">
                        <aside className="preview-sidebar">
                            <strong>{selected.title}</strong>
                            <small>First Semester · A.Y. 2026-2027</small>
                            {selected.menu.map((item) => <span key={item}>{item}</span>)}
                        </aside>

                        <div className="preview-main">
                            <p className="section-kicker">Read-only portal preview</p>
                            <h2>{selected.title}</h2>
                            <p>{selected.description}</p>

                            <div className="dashboard-grid task-grid preview-card-grid">
                                {selected.cards.map((item) => (
                                    <div className="dashboard-card task-card" key={item}>
                                        <div>
                                            <span className="task-card-label">{role}</span>
                                            <h3>{item}</h3>
                                            <p>This area is available to the authorized {role} role.</p>
                                        </div>
                                        <span className="task-card-action">Preview only</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="detail-card">
                    <h2>Select a portal</h2>
                    <p>Choose Student, Registrar, Cashier, or Department above to inspect its navigation and dashboard structure.</p>
                </section>
            )}
        </StaffPage>
    );
}

export default SystemPortals;
