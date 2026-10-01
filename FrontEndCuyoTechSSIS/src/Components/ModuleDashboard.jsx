import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

function ModuleDashboard({ title, description, areas }) {
    return (
        <>
            <Header section={title} />
            <main className="dashboard-content module-dashboard">
                <p className="eyebrow">Staff module</p>
                <h1>{title}</h1>
                <p>{description}</p>

                <div className="dashboard-grid">
                    {areas.map((area) => (
                        <section className="dashboard-card" key={area.title}>
                            <h2>{area.title}</h2>
                            <p>{area.description}</p>
                        </section>
                    ))}
                </div>
                <p className="module-note">
                    This interface is awaiting authenticated access and backend integration.
                </p>
            </main>
            <Footer />
        </>
    );
}

export default ModuleDashboard;
