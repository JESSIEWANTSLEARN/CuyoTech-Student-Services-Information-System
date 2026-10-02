import Header from "../Header.jsx";
import SideBar from "../SideBar.jsx";
import Footer from "../Footer.jsx";

function StudentPage({ title, description, children }) {
    return (
        <div>
            <Header section={title} />
            <div className="dashboard-layout">
                <SideBar />
                <main className="dashboard-content">
                    <p className="eyebrow">Student portal</p>
                    <h1>{title}</h1>
                    <p>{description}</p>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default StudentPage;
