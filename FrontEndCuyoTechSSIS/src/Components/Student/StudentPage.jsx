import Footer from "../Footer.jsx";
import Header from "../Header.jsx";
import SideBar from "../SideBar.jsx";

function StudentPage({ title, description, children }) {
    return (
        <div>
            <Header section={title} />
            <div className="dashboard-layout">
                <SideBar />
                <main className="dashboard-content">
                    <div className="page-heading">
                        <p className="eyebrow">Student services</p>
                        <h1>{title}</h1>
                        <p>{description}</p>
                    </div>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default StudentPage;
