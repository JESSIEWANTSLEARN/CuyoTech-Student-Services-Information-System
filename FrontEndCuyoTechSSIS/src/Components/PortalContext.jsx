import { useApiData } from "../hooks/useApiData.js";

export function AcademicTermCard({ compact = false }) {
    const { data } = useApiData("/portal/context", null);
    const context = data?.context;

    if (!context) {
        return null;
    }

    return (
        <div className={compact ? "term-context compact" : "term-context"}>
            <span>{context.semester}</span>
            <strong>A.Y. {context.academic_year}</strong>
            {context.course && (
                <small>{context.course}{context.year_level ? ` · Year ${context.year_level}` : ""}</small>
            )}
        </div>
    );
}

export function PortalIdentity() {
    const { data } = useApiData("/portal/context", null);
    const context = data?.context;

    if (!context) {
        return null;
    }

    return (
        <div className="portal-identity">
            <strong>{context.display_name}</strong>
            <span>{context.secondary}</span>
            {context.course && (
                <small>{context.course}{context.year_level ? ` · Year ${context.year_level}` : ""}</small>
            )}
        </div>
    );
}
