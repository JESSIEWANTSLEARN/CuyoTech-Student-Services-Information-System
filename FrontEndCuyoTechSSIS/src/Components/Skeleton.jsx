function SkeletonLine({ width = "100%" }) {
    return <span className="skeleton-line" style={{ width }} aria-hidden="true" />;
}

function SkeletonCard() {
    return (
        <section className="dashboard-card skeleton-card" aria-hidden="true">
            <SkeletonLine width="42%" />
            <SkeletonLine width="78%" />
            <SkeletonLine width="64%" />
        </section>
    );
}

function DashboardSkeleton({ cards = 4 }) {
    return (
        <div className="dashboard-grid task-grid skeleton-grid" aria-hidden="true">
            {Array.from({ length: cards }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
}

function TableSkeleton({ rows = 5, columns = 4 }) {
    return (
        <div className="table-scroll skeleton-table-wrap" aria-hidden="true">
            <table>
                <thead>
                    <tr>
                        {Array.from({ length: columns }).map((_, index) => (
                            <th key={index}><SkeletonLine width="70%" /></th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <td key={colIndex}>
                                    <SkeletonLine width={colIndex === 0 ? "72%" : "58%"} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <section className="detail-card skeleton-detail" aria-hidden="true">
            <div className="detail-grid">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index}>
                        <SkeletonLine width="38%" />
                        <SkeletonLine width="72%" />
                    </div>
                ))}
            </div>
        </section>
    );
}

export {
    SkeletonLine,
    SkeletonCard,
    DashboardSkeleton,
    TableSkeleton,
    ProfileSkeleton,
};
