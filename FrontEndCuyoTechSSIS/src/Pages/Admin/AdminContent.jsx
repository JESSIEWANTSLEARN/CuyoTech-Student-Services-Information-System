import { useState } from "react";
import StaffPage from "../../Components/StaffPage.jsx";
import { useApiData } from "../../hooks/useApiData.js";
import { apiRequest } from "../../services/api.js";

const audiences = ["all", "student", "registrar", "cashier", "department", "admin"];

function AdminContent() {
    const { data, loading, error, reload } = useApiData("/admin/content", {
        announcements: [],
        important_dates: [],
    });
    const [message, setMessage] = useState("");
    const [announcement, setAnnouncement] = useState({
        title: "",
        body: "",
        audience: "all",
        priority: "normal",
        expires_at: "",
    });
    const [date, setDate] = useState({
        title: "",
        description: "",
        event_date: "",
        audience: "student",
    });

    async function publishAnnouncement(event) {
        event.preventDefault();
        setMessage("");

        try {
            const response = await apiRequest("/admin/announcements", {
                method: "POST",
                body: JSON.stringify({
                    ...announcement,
                    expires_at: announcement.expires_at || null,
                }),
            });
            setMessage(response.message);
            setAnnouncement({ title: "", body: "", audience: "all", priority: "normal", expires_at: "" });
            reload();
        } catch (requestError) {
            setMessage(requestError.message);
        }
    }

    async function addDate(event) {
        event.preventDefault();
        setMessage("");

        try {
            const response = await apiRequest("/admin/important-dates", {
                method: "POST",
                body: JSON.stringify({
                    ...date,
                    description: date.description || null,
                }),
            });
            setMessage(response.message);
            setDate({ title: "", description: "", event_date: "", audience: "student" });
            reload();
        } catch (requestError) {
            setMessage(requestError.message);
        }
    }

    async function remove(path) {
        if (!window.confirm("Remove this item?")) {
            return;
        }

        try {
            const response = await apiRequest(path, { method: "DELETE" });
            setMessage(response.message);
            reload();
        } catch (requestError) {
            setMessage(requestError.message);
        }
    }

    return (
        <StaffPage
            role="admin"
            title="Notices & dates"
            description="Keep portal information useful and role-specific without turning SSIS into an LMS."
        >
            {message && <p className="workflow-message">{message}</p>}
            {error && <p className="workflow-message error">{error}</p>}

            <div className="admin-content-grid">
                <section className="admin-card">
                    <p className="section-kicker">University notice</p>
                    <h2>Publish announcement</h2>
                    <form className="workflow-form single-column" onSubmit={publishAnnouncement}>
                        <label>
                            Title
                            <input value={announcement.title} onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })} required />
                        </label>
                        <label>
                            Message
                            <textarea rows="4" value={announcement.body} onChange={(e) => setAnnouncement({ ...announcement, body: e.target.value })} required />
                        </label>
                        <label>
                            Audience
                            <select value={announcement.audience} onChange={(e) => setAnnouncement({ ...announcement, audience: e.target.value })}>
                                {audiences.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </label>
                        <label>
                            Priority
                            <select value={announcement.priority} onChange={(e) => setAnnouncement({ ...announcement, priority: e.target.value })}>
                                <option value="normal">Normal</option>
                                <option value="important">Important</option>
                            </select>
                        </label>
                        <label>
                            Expiration date/time (optional)
                            <input type="datetime-local" value={announcement.expires_at} onChange={(e) => setAnnouncement({ ...announcement, expires_at: e.target.value })} />
                        </label>
                        <button className="submit-button" type="submit">Publish announcement</button>
                    </form>
                </section>

                <section className="admin-card">
                    <p className="section-kicker">Schedule</p>
                    <h2>Add important date</h2>
                    <form className="workflow-form single-column" onSubmit={addDate}>
                        <label>
                            Title
                            <input value={date.title} onChange={(e) => setDate({ ...date, title: e.target.value })} required />
                        </label>
                        <label>
                            Description
                            <textarea rows="3" value={date.description} onChange={(e) => setDate({ ...date, description: e.target.value })} />
                        </label>
                        <label>
                            Date
                            <input type="date" value={date.event_date} onChange={(e) => setDate({ ...date, event_date: e.target.value })} required />
                        </label>
                        <label>
                            Audience
                            <select value={date.audience} onChange={(e) => setDate({ ...date, audience: e.target.value })}>
                                {audiences.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </label>
                        <button className="submit-button" type="submit">Add important date</button>
                    </form>
                </section>
            </div>

            {loading ? <p>Loading content...</p> : (
                <div className="admin-content-grid">
                    <section className="admin-card">
                        <h2>Published announcements</h2>
                        <div className="management-list">
                            {(data?.announcements || []).map((item) => (
                                <div key={item.id}>
                                    <div>
                                        <strong>{item.title}</strong>
                                        <span>{item.audience} · {item.priority}</span>
                                    </div>
                                    <button type="button" onClick={() => remove(`/admin/announcements/${item.id}`)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="admin-card">
                        <h2>Important dates</h2>
                        <div className="management-list">
                            {(data?.important_dates || []).map((item) => (
                                <div key={item.id}>
                                    <div>
                                        <strong>{item.title}</strong>
                                        <span>{item.event_date} · {item.audience}</span>
                                    </div>
                                    <button type="button" onClick={() => remove(`/admin/important-dates/${item.id}`)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </StaffPage>
    );
}

export default AdminContent;
