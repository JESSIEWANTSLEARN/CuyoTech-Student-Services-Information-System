function StatusBadge({ status = "unknown" }) {
    const label = String(status)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

    return (
        <span className={`status-badge status-${status}`}>
            {label}
        </span>
    );
}

export default StatusBadge;
