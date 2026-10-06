import { Link } from "react-router-dom";
import { DashboardMetrics, PortalInformation } from "./PortalHomeSections.jsx";
import StaffPage from "./StaffPage.jsx";

function ModuleDashboard({ role, title, description, areas }) {
    return (
        <StaffPage role={role} title={title} description={description}>
            <DashboardMetrics />

            <section className="dashboard-section" aria-labelledby="common-tasks-title">
                <div className="section-heading-row">
                    <div>
                        <p className="section-kicker">Quick access</p>
                        <h2 id="common-tasks-title">What do you need to do?</h2>
                    </div>
                    <p>Choose a service to continue.</p>
                </div>

                <div className="dashboard-grid task-grid">
                    {areas.map((area) => (
                        <Link className="dashboard-card task-card" key={area.title} to={area.path}>
                            <div>
                                <span className="task-card-label">{role}</span>
                                <h3>{area.title}</h3>
                                <p>{area.description}</p>
                            </div>
                            <span className="task-card-action" aria-hidden="true">Open →</span>
                        </Link>
                    ))}
                </div>
            </section>

            <PortalInformation />
        </StaffPage>
    );
}

export default ModuleDashboard;
