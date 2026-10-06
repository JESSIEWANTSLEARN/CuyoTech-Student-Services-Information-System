import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api.js";

function NotificationBell() {
    const navigate = useNavigate();
    const wrapperRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [unread, setUnread] = useState(0);

    async function load() {
        try {
            const data = await apiRequest("/notifications");
            setItems(data.notifications || []);
            setUnread(data.unread_count || 0);
        } catch {
            // Header notifications should not block the rest of the portal.
        }
    }

    useEffect(() => {
        let active = true;

        apiRequest("/notifications")
            .then((data) => {
                if (active) {
                    setItems(data.notifications || []);
                    setUnread(data.unread_count || 0);
                }
            })
            .catch(() => {
                // Header notifications should not block the rest of the portal.
            });

        function closeOnOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", closeOnOutside);

        return () => {
            active = false;
            document.removeEventListener("mousedown", closeOnOutside);
        };
    }, []);

    async function openNotification(item) {
        if (!item.read_at) {
            await apiRequest(`/notifications/${item.id}/read`, { method: "PUT" });
        }

        setOpen(false);
        await load();

        if (item.link) {
            navigate(item.link);
        }
    }

    async function markAll() {
        await apiRequest("/notifications/read-all", { method: "PUT" });
        await load();
    }

    return (
        <div className="notification-wrapper" ref={wrapperRef}>
            <button
                type="button"
                className="notification-button"
                onClick={() => setOpen((value) => !value)}
                aria-label={`${unread} unread notifications`}
                aria-expanded={open}
            >
                <span aria-hidden="true">🔔</span>
                {unread > 0 && <strong>{unread > 9 ? "9+" : unread}</strong>}
            </button>

            {open && (
                <div className="notification-panel">
                    <div className="notification-panel-heading">
                        <div>
                            <strong>Notifications</strong>
                            <span>{unread} unread</span>
                        </div>
                        {unread > 0 && <button type="button" onClick={markAll}>Mark all read</button>}
                    </div>

                    <div className="notification-list">
                        {items.length === 0 ? (
                            <p>No notifications yet.</p>
                        ) : items.slice(0, 8).map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={item.read_at ? "notification-item" : "notification-item unread"}
                                onClick={() => openNotification(item)}
                            >
                                <strong>{item.title}</strong>
                                <span>{item.message}</span>
                                <small>{new Date(item.created_at).toLocaleString()}</small>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
