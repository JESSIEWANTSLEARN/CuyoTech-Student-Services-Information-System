import { useApiData } from "../hooks/useApiData.js";
import { DashboardSkeleton, SkeletonLine } from "./Skeleton.jsx";

export function DashboardMetrics() {
    const { data, loading } = useApiData("/portal/summary", { metrics: [] });
    const metrics = data?.metrics || [];

    if (loading) {
        return (
            <section className="portal-metrics skeleton-metrics" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index}>
                        <SkeletonLine width="35%" />
                        <SkeletonLine width="70%" />
                    </div>
                ))}
            </section>
        );
    }

    if (metrics.length === 0) {
        return null;
    }

    return (
        <section className="portal-metrics" aria-label="Portal summary">
            {metrics.map((metric) => (
                <div key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                </div>
            ))}
        </section>
    );
}

export function PortalInformation() {
    const { data, loading, error } = useApiData("/portal/content", {
        announcements: [],
        important_dates: [],
    });

    if (loading) {
        return (
            <section className="portal-information-grid" aria-hidden="true">
                <div className="portal-info-card">
                    <SkeletonLine width="28%" />
                    <SkeletonLine width="45%" />
                    <DashboardSkeleton cards={2} />
                </div>
                <aside className="portal-info-card dates-card">
                    <SkeletonLine width="35%" />
                    <SkeletonLine width="60%" />
                    <SkeletonLine width="75%" />
                    <SkeletonLine width="68%" />
                </aside>
            </section>
        );
    }

    if (error) {
        return null;
    }

    const announcements = data?.announcements || [];
    const dates = data?.important_dates || [];

    if (announcements.length === 0 && dates.length === 0) {
        return null;
    }

    return (
        <section className="portal-information-grid">
            <div className="portal-info-card">
                <div className="section-heading-row compact">
                    <div>
                        <p className="section-kicker">University information</p>
                        <h2>Notices</h2>
                    </div>
                </div>

                <div className="announcement-list">
                    {announcements.length === 0 ? (
                        <p className="empty-copy">No current notices.</p>
                    ) : announcements.map((announcement) => (
                        <article className={announcement.priority === "important" ? "announcement important" : "announcement"} key={announcement.id}>
                            <div>
                                <span>{announcement.audience === "all" ? "University" : announcement.audience}</span>
                                {announcement.priority === "important" && <strong>Important</strong>}
                            </div>
                            <h3>{announcement.title}</h3>
                            <p>{announcement.body}</p>
                        </article>
                    ))}
                </div>
            </div>

            <aside className="portal-info-card dates-card">
                <div className="section-heading-row compact">
                    <div>
                        <p className="section-kicker">Plan ahead</p>
                        <h2>Important dates</h2>
                    </div>
                </div>

                <div className="date-list">
                    {dates.length === 0 ? (
                        <p className="empty-copy">No upcoming dates.</p>
                    ) : dates.map((item) => {
                        const date = new Date(`${item.event_date}T00:00:00`);
                        return (
                            <div className="important-date" key={item.id}>
                                <div className="date-box">
                                    <strong>{date.toLocaleDateString(undefined, { day: "2-digit" })}</strong>
                                    <span>{date.toLocaleDateString(undefined, { month: "short" })}</span>
                                </div>
                                <div>
                                    <strong>{item.title}</strong>
                                    <span>{item.description || "University schedule"}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>
        </section>
    );
}
