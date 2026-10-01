import { Link } from "react-router-dom";
import StaffPage from "./StaffPage.jsx";

function ModuleDashboard({ role, title, description, areas }) {
    return (
        <StaffPage role={role} title={title} description={description}>
                <div className="dashboard-grid">
                    {areas.map((area) => (
                        <section className="dashboard-card" key={area.title}>
                            <h2>{area.title}</h2>
                            <p>{area.description}</p>
                            <Link to={area.path} className="action-link">View {area.title.toLowerCase()}</Link>
                        </section>
                    ))}
                </div>
        </StaffPage>
    );
}

export default ModuleDashboard;
